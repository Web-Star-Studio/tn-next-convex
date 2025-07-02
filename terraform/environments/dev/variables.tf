variable "aws_region" {
  description = "Região AWS para o ambiente de desenvolvimento."
  type        = string
  default     = "us-east-1" # Pode ser sobrescrito se necessário
}

variable "project_name" {
  description = "Nome do projeto."
  type        = string
  default     = "tucanoronha" # Herdado do global, mas pode ser específico
}

variable "environment_name" {
  description = "Nome específico deste ambiente."
  type        = string
  default     = "dev"
}

variable "global_tags" {
  description = "Tags globais herdadas."
  type        = map(string)
  default     = {} # Será preenchido pelo chamador ou pode ter padrões aqui
}

# Variáveis específicas do Módulo VPC para o ambiente dev
variable "vpc_cidr_block" {
  description = "Bloco CIDR para a VPC de desenvolvimento."
  type        = string
  default     = "10.10.0.0/16" # CIDR diferente do padrão do módulo para evitar conflitos se usado em outro lugar
}

variable "public_subnet_cidr_blocks" {
  description = "Lista de blocos CIDR para as subnets públicas de desenvolvimento."
  type        = list(string)
  default     = ["10.10.1.0/24", "10.10.2.0/24"]
}

variable "private_subnet_cidr_blocks" {
  description = "Lista de blocos CIDR para as subnets privadas de desenvolvimento."
  type        = list(string)
  default     = ["10.10.101.0/24", "10.10.102.0/24"]
}

variable "enable_nat_gateway" {
  description = "Se deve criar NAT Gateways para as subnets privadas no ambiente de desenvolvimento."
  type        = bool
  default     = true # Normalmente útil para dev também
}

# Variáveis específicas do Módulo ECR para o ambiente dev
variable "ecr_repository_names" {
  description = "Lista de nomes base para os repositórios ECR no ambiente de desenvolvimento."
  type        = list(string)
  # Estes serão os nomes dos seus microserviços
  default     = ["user-service", "activity-catalog-service"] # Adicionar mais conforme necessário
}
