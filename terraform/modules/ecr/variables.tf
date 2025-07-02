variable "project_name" {
  description = "Nome do projeto para prefixar nomes de repositórios."
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)."
  type        = string
}

variable "tags" {
  description = "Tags a serem aplicadas aos repositórios."
  type        = map(string)
  default     = {}
}

variable "repository_names" {
  description = "Lista de nomes base para os repositórios ECR (ex: 'user-service', 'activity-service')."
  type        = list(string)
  default     = []
}

variable "max_image_count" {
  description = "Número máximo de imagens a serem mantidas por repositório pela política de ciclo de vida."
  type        = number
  default     = 10
}

variable "untagged_image_expire_days" {
  description = "Número de dias após os quais as imagens não taggeadas expiram."
  type        = number
  default     = 30
}
