# Idempotent seed data — safe to re-run at any time.

puts "Seeding users..."

users = [
  { name: "Alice Johnson", email: "alice@example.com" },
  { name: "Bob Smith",     email: "bob@example.com" },
  { name: "Carol White",   email: "carol@example.com" }
].map do |attrs|
  User.find_or_create_by!(email: attrs[:email]) do |u|
    u.name                  = attrs[:name]
    u.password              = "password123"
    u.password_confirmation = "password123"
  end
end

puts "  #{users.size} users ready."

puts "Seeding videos..."

videos = [
  {
    user:        users[0],
    title:       "Rick Astley - Never Gonna Give You Up",
    description: "The classic 1987 hit that started a thousand memes.",
    link:        "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    user:        users[1],
    title:       "Rails 8 in 100 Seconds",
    description: "A quick overview of what's new in Ruby on Rails 8.",
    link:        "https://www.youtube.com/watch?v=6jXNBTFBFwQ"
  },
  {
    user:        users[2],
    title:       "Clean Architecture - Uncle Bob",
    description: "Robert C. Martin explains clean architecture principles.",
    link:        "https://www.youtube.com/watch?v=2dKZ-dWaCiU"
  },
  {
    user:        users[0],
    title:       "Ruby in 100 Seconds",
    description: "A rapid-fire intro to the Ruby programming language.",
    link:        "https://www.youtube.com/watch?v=UYm0kfnRTJk"
  },
  {
    user:        users[1],
    title:       "Action Cable — Real-Time Rails",
    description: "How to build real-time features with Action Cable and WebSockets.",
    link:        "https://www.youtube.com/watch?v=n0WUjGkDFS0"
  }
].map do |attrs|
  Video.find_or_create_by!(link: attrs[:link]) do |v|
    v.user        = attrs[:user]
    v.title       = attrs[:title]
    v.description = attrs[:description]
  end
end

puts "  #{videos.size} videos ready."
puts "Done!"
