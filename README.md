# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)  WEB DEVELOPMENT IMMERSIVE

## Getting started

1. Fork
1. Create a feature branch
1. Clone
1. Pull Request

# Rails Auth

### Objectives

*After this lesson, students will be able to:*
- Understand how to set and retrieve data from `jwt`
- Know how to set and check passwords using `BCrypt`
- Understand how to keep track of a `current_user`
- Be able to create a Rails app with Auth and a React front end
  - Not from memory, but from following along with an example

### Preparation

*Before this lesson, students should:*
- Be able to make a Rails app without auth
- Have practice creating app with auth in another framework (like express)

---

Let's build our auth from scratch.  Many Rails developers fallback on using gems like [devise](https://github.com/plataformatec/devise) or [knock](https://github.com/nsarno/knock) but it's very important to understand how authentication actually works.

All we will need two encryption gems and the rest is handled by our own code!

## Users

For this app, our users will have a username, an email, and for auth, we will give them a password_digest. Let's create that in terminal now:

```shell

rails g scaffold User username:string email:string password_digest:string

```

## Passwords

For this lesson we will be using [`bcrypt`](https://github.com/codahale/bcrypt-ruby) for our passwords.  Add (or uncomment) `bcrypt` in your `Gemfile`.

Of course, with a new gem we need to:

```shell

bundle install

```

Bcrypt comes with a number of handy features in Rails that just adds to the Rails magic. The first worth noting is a method which we can call in the user model:

```ruby

class User < ApplicationRecord
  has_secure_password
end

```

[has_secure_password](https://api.rubyonrails.org/classes/ActiveModel/SecurePassword/ClassMethods.html) has built-in validations for passwords. It will ensure that a password is provided. It will also automatically create a password hash from a provided password and set it as the `password_digest` when creating a user. We also have access to a method called [authenticate](https://api.rubyonrails.org/classes/ActiveModel/SecurePassword/InstanceMethodsOnActivation.html#method-i-authenticate) that will verify a given password attempt against a user's password_digest. For now, lets just start by adding `has_secure_password` to our User model

Since Bcrypt will take a password and create a password_digest for us, our `UsersController` needs to permit a `:password` instead of a `:password_digest` inside of our private `user_params` method:

```ruby

  def user_params
    params.require(:user).permit( :username, :email, :password )
  end

```

### Validating passwords

We can always add some more custome validation to our passwords. For this app, lets try this:

```ruby

class User < ApplicationRecord
  has_secure_password

validates :password,
            length: { minimum: 6 },
            if: -> { new_record? || !password.nil? }

end

```

`new_record?` is a method baked into Rails that will check to see if an ActiveRecord object has been saved to the database yet. As implied by the `?`, it returns true or false. This validation say for every new entry, the password must be a minimum of 6 characters long.

### Other User Validations

While we're at it, let's add some validations for username and email as well:

```ruby

class User < ApplicationRecord
  has_secure_password

  validates :username, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password,
            length: { minimum: 6 },
            if: -> { new_record? || !password.nil? }

end

```

Here we make sure that both the username and email are unique and present. For the email, we check to make sure that a proper email format was provided. We do this using [URI](https://ruby-doc.org/stdlib-2.1.1/libdoc/uri/rdoc/URI.html) which stands for Uniform Resoure Identifers. URI is a baked in module in Rails.

## JSON Web Tokens

For tracking the logged in users on our front end, we will be sending a [JWT](https://github.com/jwt/ruby-jwt). But first lets implement that on our backend. We can start by adding it to our `Gemfile`:

```ruby

# Use Json Web Token (JWT) for token based authentication
gem 'jwt'

```

Don't forget to `Bundle install`!

For the JWT gem package, we're going to make a custom class with some methods to help us out. This will help keep our controllers small and organized. In our `/lib` directory, lets make a new file called `json_web_token.rb`.

Inside this file, we will add two methods for encoding and decoding tokens:

```ruby

class JsonWebToken
  SECRET_KEY = Rails.application.secrets.secret_key_base.to_s

  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new decoded
  end
end

```

The token is encoded and decoded with the built in Rails secret key. It also requires an expiration time, which we have set for 24 hours.

In order for us to have access to this class, we need to add the `/lib` directory to be loaded when we run our API server. To do this, we can add the following line of code to `/config/application.rb`:

```ruby

config.autoload_paths << Rails.root.join('lib')

```

Now, we are all set to use JWT with our custom helper methods.

## Authentication

### Custom Controller

Our `UsersController` right now does not have any way to login/authenticate a user nor does it return a JSON web token. Additionally we do not have an endpoint in our routes for this either. We can fix this be creating a new controller for authentication.

```shell

rails g controller Authentication

```

In our authetication controller, we need to define a method that will verify login credentials and return a JSON web token:

```ruby

class AuthenticationController < ApplicationController

  # POST /auth/login
  def login
    @user = User.find_by_username(params[:username])
    if @user.authenticate(params[:password]) #authenticate method provided by Bcrypt and 'has_secure_password'
      token = JsonWebToken.encode(user_id: @user.id, username: @user.username)
      render json: { token: token }, status: :ok
    else
      render json: { error: 'unauthorized' }, status: :unauthorized
    end
  end

  private

  def login_params
    params.permit(:username, :password)
  end
end

```

Here, we first find the user based on the provided username. We then use the Bcrypt helper method `.authenticate` to verify that the provided password matches the encoded `password_digest` from our database for our user.

We then use our `JsonWebToken.encode` method to create a token with the user's `id` and `username` inside the token.

### Login Route

In our `routes.rb` we just need to add a line of code that directs to our new authentication method:

```ruby

Rails.application.routes.draw do
  post '/auth/login', to: 'authentication#login'
  resources :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :teachers
  
end

```

## Application Controller

So now we can create new Users. We can also authenticate a login attempt. We also want to have a way to authenticate requests from that have logged in. We can do this by creating a method that authorizes a request based on the authorization header. Since we want this method to be available for all controllers, we can define this method in `ApplicationController`. Since all other controller inherit from `ApplicationController` any method defined there will be available to us in any controller.

```ruby

class ApplicationController < ActionController::API

  def authorize_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    begin
      @decoded = JsonWebToken.decode(header)
      @current_user = User.find(@decoded[:user_id])
    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: e.message }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { errors: e.message }, status: :unauthorized
    end
  end

end

```

Our `authorize_request` method first grabs the auth header. It then splits out the token from the header. Once we have the token, we can use our `JsonWebToken.decode` helper method to pull the user info from the token. Then we can set an instanse variable `@current_user` using the user_id from the token data. Now we have the user data preset in any controller that we call the `authorize_request` method. If the user can't be found or the token isn't valid, we raise an `unauthorized` error.

We can test this out by adding a before action to our `UsersController`:

```ruby

before_action :authorize_request, except: :create

```

We can also add it to our `TeachersController`:

```ruby

before_action :authorize_request, except: %i[index show]

```


Now we've done it! We have a fully built out auth in our app. We have a lot of moving parts here and it can be difficult to keep track of everything. That's why we don't expect you to know this all by heart but it's important to understand whats going on.

## Wrapping Up

In short:

- Brcypt methods `has_secure_password` and `.authenticate` are used to hash and verify passwords

- JWT is used to encrypt user data and also authorize our controller actions

- We created a custome JsonWebToken class and added it to the Rails autoload paths

- We created an AuthorizationController and endpoint in our routes to handle logins

- We created an `authorize_request` method to secure our controller actions.


## Front End

The auth forms have already been added to the front end so we can already test out our auth functionality.