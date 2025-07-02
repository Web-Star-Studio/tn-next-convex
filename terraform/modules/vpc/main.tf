resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(var.tags, {
    Name = "${var.project_name}-vpc-${var.environment}"
  })
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(var.tags, {
    Name = "${var.project_name}-igw-${var.environment}"
  })
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidr_blocks)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidr_blocks[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index % length(data.aws_availability_zones.available.names)]
  map_public_ip_on_launch = true

  tags = merge(var.tags, {
    Name                                = "${var.project_name}-public-subnet-${count.index + 1}-${var.environment}"
    "kubernetes.io/role/elb"            = "1" # Para descoberta de Load Balancers por Kubernetes
    "kubernetes.io/cluster/${var.project_name}-${var.environment}-eks" = "shared" # Para EKS
  })
}

resource "aws_subnet" "private" {
  count                   = length(var.private_subnet_cidr_blocks)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.private_subnet_cidr_blocks[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index % length(data.aws_availability_zones.available.names)]
  map_public_ip_on_launch = false

  tags = merge(var.tags, {
    Name                                = "${var.project_name}-private-subnet-${count.index + 1}-${var.environment}"
    "kubernetes.io/role/internal-elb"   = "1" # Para descoberta de Load Balancers internos por Kubernetes
    "kubernetes.io/cluster/${var.project_name}-${var.environment}-eks" = "shared" # Para EKS
  })
}

resource "aws_eip" "nat" {
  count = var.enable_nat_gateway ? length(var.public_subnet_cidr_blocks) : 0 # Um NAT Gateway por AZ para alta disponibilidade
  domain = "vpc"

  tags = merge(var.tags, {
    Name = "${var.project_name}-nat-eip-${count.index + 1}-${var.environment}"
  })
}

resource "aws_nat_gateway" "main" {
  count         = var.enable_nat_gateway ? length(var.public_subnet_cidr_blocks) : 0
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id # NAT Gateway reside na subnet pública

  tags = merge(var.tags, {
    Name = "${var.project_name}-nat-gw-${count.index + 1}-${var.environment}"
  })

  depends_on = [aws_internet_gateway.main]
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-public-rt-${var.environment}"
  })
}

resource "aws_route_table_association" "public" {
  count          = length(var.public_subnet_cidr_blocks)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  count  = var.enable_nat_gateway ? length(var.private_subnet_cidr_blocks) : 0
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index % length(aws_nat_gateway.main)].id # Distribui subnets privadas entre os NAT Gateways
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-private-rt-${count.index + 1}-${var.environment}"
  })
}

resource "aws_route_table_association" "private" {
  count          = var.enable_nat_gateway ? length(var.private_subnet_cidr_blocks) : 0
  # Associa cada subnet privada a uma tabela de rotas privada específica (se houver múltiplos NAT GWs)
  # ou a uma única tabela de rotas privada se todos usarem o mesmo NAT GW.
  # Para simplicidade, aqui cada subnet privada pode ter sua própria tabela de rotas se múltiplos NATs.
  # Se quiser usar menos tabelas de rotas, a lógica de associação e criação da aws_route_table.private muda.
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# Para obter as AZs disponíveis na região
data "aws_availability_zones" "available" {}
