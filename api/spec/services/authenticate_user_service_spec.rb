require "rails_helper"

RSpec.describe AuthenticateUserService do
  subject(:service) { described_class.new(user_repository: user_repo) }

  let(:user_repo) { instance_double(UserRepository) }

  describe "#call" do
    context "when credentials are valid" do
      let(:user) { create(:user, email: "alice@example.com", password: "pass123", password_confirmation: "pass123") }

      before do
        allow(user_repo).to receive(:find_by_email).with("alice@example.com").and_return(user)
      end

      it "returns a successful result" do
        result = service.call(email: "alice@example.com", password: "pass123")
        expect(result).to be_success
      end

      it "includes a JWT token in data" do
        result = service.call(email: "alice@example.com", password: "pass123")
        expect(result.data[:token]).to be_a(String)
        expect(result.data[:token]).not_to be_empty
      end

      it "includes the user in data" do
        result = service.call(email: "alice@example.com", password: "pass123")
        expect(result.data[:user]).to eq(user)
      end
    end

    context "when the user does not exist" do
      before do
        allow(user_repo).to receive(:find_by_email).and_return(nil)
      end

      it "returns a failure result" do
        result = service.call(email: "nobody@example.com", password: "pass123")
        expect(result).to be_failure
      end

      it "includes an error message" do
        result = service.call(email: "nobody@example.com", password: "pass123")
        expect(result.errors).to include("Invalid email or password")
      end
    end

    context "when the password is wrong" do
      let(:user) { create(:user, email: "alice@example.com", password: "pass123", password_confirmation: "pass123") }

      before do
        allow(user_repo).to receive(:find_by_email).and_return(user)
      end

      it "returns a failure result" do
        result = service.call(email: "alice@example.com", password: "wrongpassword")
        expect(result).to be_failure
      end
    end
  end
end
