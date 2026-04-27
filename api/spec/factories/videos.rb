FactoryBot.define do
  factory :video do
    title       { Faker::Lorem.sentence(word_count: 4) }
    description { Faker::Lorem.paragraph }
    link        { "https://www.youtube.com/watch?v=#{Faker::Alphanumeric.alphanumeric(number: 11)}" }
    association :user
  end
end
