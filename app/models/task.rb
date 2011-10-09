class Task < ActiveRecord::Base
   belongs_to :user
   has_many :comments
end
# == Schema Information
#
# Table name: tasks
#
#  id               :integer         not null, primary key
#  name             :string(255)
#  user_id          :integer
#  assigned_date    :datetime
#  opened_date      :datetime
#  expectation_date :datetime
#  closed_date      :datetime
#  created_at       :datetime
#  updated_at       :datetime
#