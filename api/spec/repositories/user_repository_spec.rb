require "rails_helper"

RSpec.describe UserRepository do
  subject(:repo) { described_class.new }

  describe "#find_by_email" do
    it "returns the user with matching email" do
      user = create(:user, email: "test@example.com")
      expect(repo.find_by_email("test@example.com")).to eq(user)
    end

    it "returns nil when no user matches" do
      expect(repo.find_by_email("nobody@example.com")).to be_nil
    end
  end

  describe "#find_by_id" do
    it "returns the user with matching id" do
      user = create(:user)
      expect(repo.find_by_id(user.id)).to eq(user)
    end

    it "returns nil for unknown id" do
      expect(repo.find_by_id(0)).to be_nil
    end
  end

  describe "#build" do
    it "instantiates a User without persisting it" do
      user = repo.build(name: "Alice", email: "alice@example.com", password: "pass123")
      expect(user).to be_a(User)
      expect(user).to be_new_record
    end
  end

  describe "#save" do
    it "persists a valid user and returns true" do
      user = repo.build(name: "Alice", email: "alice@example.com", password: "pass123",
                        password_confirmation: "pass123")
      expect(repo.save(user)).to be true
      expect(user).to be_persisted
    end

    it "returns false for an invalid user" do
      user = repo.build(name: "", email: "bad", password: "pass123")
      expect(repo.save(user)).to be false
    end
  end
end
