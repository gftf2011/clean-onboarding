terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  backend "s3" {
    bucket = "clean-onboarding-api-devops-tf-state"
    key = "clean-onboarding-api-lock-state"
    region = "us-east-1"
    encrypt = true
    dynamodb_table = "clean-onboarding-api-devops-tf-state-lock"
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"
  comman_tags = {
    Environment = terraform.workspace
    Project = var.project
    Owner = var.project_owner
    Contact = var.email_contact
    ManagedBy = "Terraform"
  }
}
