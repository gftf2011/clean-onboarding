terraform {
  backend "s3" {
    bucket = "clean-onboarding-api-devops-tfstate"
    key = "clean-onboarding-tfstate"
    region = "us-east-1"
    encrypt = true
    dynamodb_table = "clean-onboarding-api-devops-tf-state-lock"
  }
}

provider "aws" {
  region = "us-east-1"
}