terraform {
  backend "s3" {
    bucket = "clean-onboarding-api-devops-tfstate"
    key = "clean-onboarding-tfstate"
    region = "us-east-1"
    encrypt = true
    dynamodb_table = "clean-onboarding-api-devops-tf-state-lock"
  }
}

# Configure the AWS Provider
provider "aws" {
  shared_credentials_file = "~/.aws/credentials"
  region = "us-east-1"
  version = "~> 2.50.0"
}