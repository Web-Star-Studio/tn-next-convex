terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  // Backend S3 para o estado do ambiente de desenvolvimento
  // backend "s3" {
  //   bucket         = "seu-terraform-state-bucket-nome-unico" # Certifique-se que este bucket existe
  //   key            = "dev/terraform.tfstate"
  //   region         = "us-east-1" # Mude para a região do seu bucket S3
  //   encrypt        = true
  //   dynamodb_table = "terraform-state-lock-dynamo" # Certifique-se que esta tabela DynamoDB existe
  // }
}

provider "aws" {
  region = var.aws_region
  # Assume que as credenciais são fornecidas via variáveis de ambiente,
  # perfil EC2, ou perfil AWS configurado no CLI.
}

module "vpc" {
  source = "../../modules/vpc" # Caminho para o módulo VPC

  project_name = var.project_name
  environment  = var.environment_name
  tags         = local.common_tags
  aws_region   = var.aws_region

  vpc_cidr_block             = var.vpc_cidr_block
  public_subnet_cidr_blocks  = var.public_subnet_cidr_blocks
  private_subnet_cidr_blocks = var.private_subnet_cidr_blocks
  enable_nat_gateway         = var.enable_nat_gateway
}

module "ecr_repositories" {
  source = "../../modules/ecr" # Caminho para o módulo ECR

  project_name     = var.project_name
  environment      = var.environment_name
  tags             = local.common_tags
  repository_names = var.ecr_repository_names
}

locals {
  common_tags = merge(var.global_tags, {
    Environment = var.environment_name # Sobrescreve a tag Environment global
  })
}
