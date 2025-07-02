terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  // Configuração do backend para estado remoto (recomendado para colaboração e produção)
  // Para este exemplo inicial, o estado será local.
  // backend "s3" {
  //   bucket         = "seu-terraform-state-bucket-nome-unico"
  //   key            = "global/s3/terraform.tfstate"
  //   region         = "us-east-1" # Mude para sua região
  //   encrypt        = true
  //   dynamodb_table = "terraform-state-lock-dynamo" # Para bloqueio de estado
  // }
}
