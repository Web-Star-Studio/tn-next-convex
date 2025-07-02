variable "aws_region" {
  description = "Região AWS para provisionar os recursos."
  type        = string
  default     = "us-east-1" # Altere para sua região padrão preferida
}

variable "project_name" {
  description = "Nome do projeto, usado para nomear recursos."
  type        = string
  default     = "tucanoronha"
}

variable "environment" {
  description = "Ambiente de deploy (ex: dev, staging, prod)."
  type        = string
  default     = "dev" # Default para execuções globais, será sobrescrito por ambientes
}

variable "tags" {
  description = "Tags comuns para aplicar a todos os recursos."
  type        = map(string)
  default = {
    Project     = "Tuca Noronha Platform"
    Environment = "dev" # Será sobrescrito por variáveis de ambiente específicas
    ManagedBy   = "Terraform"
  }
}
