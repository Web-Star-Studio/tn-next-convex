output "repository_urls" {
  description = "Map dos nomes dos repositórios para seus URLs."
  value = {
    for name in var.repository_names :
    name => aws_ecr_repository.main[name].repository_url
  }
}

output "repository_arns" {
  description = "Map dos nomes dos repositórios para seus ARNs."
  value = {
    for name in var.repository_names :
    name => aws_ecr_repository.main[name].arn
  }
}
