output "vpc_id" {
  description = "ID da VPC criada."
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "Bloco CIDR da VPC."
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "Lista de IDs das subnets públicas."
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Lista de IDs das subnets privadas."
  value       = aws_subnet.private[*].id
}

output "nat_gateway_public_ips" {
  description = "IPs públicos dos NAT Gateways (se criados)."
  value       = var.enable_nat_gateway ? aws_eip.nat[*].public_ip : []
}

output "internet_gateway_id" {
  description = "ID do Internet Gateway."
  value       = aws_internet_gateway.main.id
}
