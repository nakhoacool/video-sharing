require "rails_helper"

RSpec.describe RegisterUserService do
  subject(:service) { described_class.new(user_repository: user_repo) }

  let(:user_repo) { instance_double(UserRepository) }

  let(:valid_params) do
    { name: "Alice", email: "alice@example.com", password: "pass123", password_confirmation: "pass123" }
  end

  describe "#call" do
    context "with valid params" do
      let(:user) { build(:user) }

      before do
        allow(user_repo).to receive(:build).with(valid_params).and_return(user)
        allow(user_repo).to receive(:save).with(user).and_return(true)
      end

      it "returns a successful result" do
        result = service.call(valid_params)
        expect(result).to be_success
      end

      it "returns the user as data" do
        result = service.call(valid_params)
        expect(result.data).to eq(user)
      end
    end

    context "with invalid params" do
      let(:user) { build(:user) }

      before do
        user.errors.add(:email, "has already been taken")
        allow(user_repo).to receive(:build).and_return(user)
        allow(user_repo).to receive(:save).and_return(false)
      end

      it "returns a failure result" do
        result = service.call(valid_params.merge(email: "taken@example.com"))
        expect(result).to be_failure
      end

      it "includes error messages" do
        result = service.call(valid_params.merge(email: "taken@example.com"))
        expect(result.errors).not_to be_empty
      end
    end
  end
end
