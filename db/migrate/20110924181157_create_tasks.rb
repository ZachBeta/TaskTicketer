class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :name
      t.integer :user_id
      t.datetime :assigned_date
      t.datetime :opened_date
      t.datetime :expectation_date
      t.datetime :closed_date

      t.timestamps
    end
  end
end
