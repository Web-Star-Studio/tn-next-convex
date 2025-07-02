variable "project_name" {
  description = "Nome do projeto para prefixar recursos."
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)."
  type        = string
}

variable "tags" {
  description = "Tags a serem aplicadas aos recursos."
  type        = map(string)
  default     = {}
}

variable "vpc_cidr_block" {
  description = "Bloco CIDR para a VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr_blocks" {
  description = "Lista de blocos CIDR para as subnets públicas."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"] # Exemplo para 2 AZs
}

variable "private_subnet_cidr_blocks" {
  description = "Lista de blocos CIDR para as subnets privadas."
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"] # Exemplo para 2 AZs
}

variable "enable_nat_gateway" {
  description = "Se deve criar NAT Gateways para as subnets privadas."
  type        = bool
  default     = true
}

variable "aws_region" {
  description = "Região AWS."
  type        = string
}
