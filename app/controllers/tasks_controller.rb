class TasksController < ApplicationController
  # GET /tasks
  # GET /tasks.json
  def index
    @tasks = Task.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @tasks }
    end
  end

  # GET /tasks/1
  # GET /tasks/1.json
  def show
    @task = Task.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @task.to_json(:include => {:user => {:only => [:username, :email]}}) }
    end
  end

  # GET /tasks/new
  # GET /tasks/new.json
  def new
    if current_user
      @task = current_user.tasks.new
      respond_to do |format|
        format.html # new.html.erb
        format.json { render json: @task }
      end
    else
      redirect_to tasks_path, notice: 'Please Log In First.'
    end
  end

  # GET /tasks/1/edit
  def edit
    if current_user
        @task = current_user.tasks.find(params[:id])
    else
      redirect_to tasks_path, notice: 'Please Log In First.'
    end
  end

  # POST /tasks
  # POST /tasks.json
  def create
    if current_user
      @task = current_user.tasks.new(params[:task])
      @task.update_attributes(:assigned_date => Time.now, :opened_date => Time.now, :expectation_date => Time.now + 1.day, :closed_date => Time.now + 2.days)
      respond_to do |format|
        if @task.save
          format.html { redirect_to tasks_path, notice: 'Task was successfully created.' }
          format.json { render json: @task, status: :created, location: @task }
        else
          format.html { render action: "new" }
          format.json { render json: @task.errors, status: :unprocessable_entity }
        end
      end
    else
      redirect_to tasks_path, notice: 'Please Log In First.'
    end
  end

  # PUT /tasks/1
  # PUT /tasks/1.json
  def update
    if current_user
      @task = current_user.tasks.find(params[:id])
      respond_to do |format|
        if @task.update_attributes(params[:task])
          format.html { redirect_to @task, notice: 'Task was successfully updated.' }
          format.json { head :ok }
        else
          format.html { render action: "edit" }
          format.json { render json: @task.errors, status: :unprocessable_entity }
        end
      end
    else
      redirect_to tasks_path, notice: 'Please Log In First.'
    end
  end

  # DELETE /tasks/1
  # DELETE /tasks/1.json
  def destroy
    if current_user
      @task = current_user.tasks.find(params[:id])
      @task.destroy
  
      respond_to do |format|
        format.html { redirect_to tasks_url }
        format.json { head :ok }
      end
    else
      redirect_to tasks_path, notice: 'Please Log In First.'
    end
  end
end
