resource "aws_ecr_repository" "main" {
  for_each = toset(var.repository_names)

  name                 = "${var.project_name}-${each.key}-${var.environment}" # Ex: tucanoronha-user-service-dev
  image_tag_mutability = "MUTABLE"                                           # Ou "IMMUTABLE" para mais segurança

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${each.key}-${var.environment}"
  })
}

# Política de ciclo de vida opcional para limpar imagens antigas
resource "aws_ecr_lifecycle_policy" "main" {
  for_each   = toset(var.repository_names)
  repository = aws_ecr_repository.main[each.key].name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1,
        description  = "Manter apenas as últimas ${var.max_image_count} imagens",
        selection = {
          tagStatus   = "any",
          countType   = "imageCountMoreThan",
          countNumber = var.max_image_count
        },
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2,
        description  = "Expirar imagens não taggeadas com mais de ${var.untagged_image_expire_days} dias",
        selection = {
          tagStatus   = "untagged",
          countType   = "sinceImagePushed",
          countUnit   = "days",
          countNumber = var.untagged_image_expire_days
        },
        action = {
          type = "expire"
        }
      }
    ]
  })
}
