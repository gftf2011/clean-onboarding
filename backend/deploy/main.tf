terraform {
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
  version = "~> 3.37"
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"
}
