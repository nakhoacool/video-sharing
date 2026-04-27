require "rails_helper"

RSpec.describe "/api/v1/auth", type: :request do
  describe "POST /api/v1/auth/register" do
    let(:valid_params) do
      {
        name: "Alice",
        email: "alice@example.com",
        password: "password123",
        password_confirmation: "password123"
      }
    end

    context "with valid parameters" do
      it "creates a user and returns 201" do
        expect {
          post "/api/v1/auth/register", params: valid_params
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it "returns a JWT token and user data" do
        post "/api/v1/auth/register", params: valid_params
        body = json_response
        expect(body[:token]).to be_a(String)
        expect(body[:user][:email]).to eq("alice@example.com")
      end
    end

    context "with duplicate email" do
      before { create(:user, email: "alice@example.com") }

      it "returns 422 unprocessable_entity" do
        post "/api/v1/auth/register", params: valid_params
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response[:errors]).not_to be_empty
      end
    end

    context "with missing required fields" do
      it "returns 422 with error details" do
        post "/api/v1/auth/register", params: { email: "", password: "pass" }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "POST /api/v1/auth/login" do
    let!(:user) { create(:user, email: "bob@example.com", password: "secret123", password_confirmation: "secret123") }

    context "with correct credentials" do
      it "returns 200 with token and user" do
        post "/api/v1/auth/login", params: { email: "bob@example.com", password: "secret123" }
        expect(response).to have_http_status(:ok)
        body = json_response
        expect(body[:token]).to be_a(String)
        expect(body[:user][:email]).to eq("bob@example.com")
      end
    end

    context "with wrong password" do
      it "returns 401 unauthorized" do
        post "/api/v1/auth/login", params: { email: "bob@example.com", password: "wrongpassword" }
        expect(response).to have_http_status(:unauthorized)
        expect(json_response[:errors]).to include("Invalid email or password")
      end
    end

    context "with unknown email" do
      it "returns 401 unauthorized" do
        post "/api/v1/auth/login", params: { email: "nobody@example.com", password: "secret123" }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
