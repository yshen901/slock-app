# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_01_07_132540) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "channel_users", force: :cascade do |t|
    t.integer "channel_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "workspace_id", null: false
    t.boolean "starred", default: false
    t.boolean "active", default: true
    t.index ["channel_id", "user_id"], name: "index_channel_users_on_channel_id_and_user_id", unique: true
    t.index ["channel_id"], name: "index_channel_users_on_channel_id"
    t.index ["user_id"], name: "index_channel_users_on_user_id"
  end

  create_table "channels", force: :cascade do |t|
    t.string "name", null: false
    t.integer "workspace_id", null: false
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "channel_type", default: "channel"
    t.boolean "dm_channel", default: false
    t.string "topic", null: false
    t.index ["name", "workspace_id", "dm_channel"], name: "index_channels_on_name_and_workspace_id_and_dm_channel", unique: true
    t.index ["workspace_id"], name: "index_channels_on_workspace_id"
  end

  create_table "dm_channel_users", force: :cascade do |t|
    t.integer "channel_id", null: false
    t.integer "user_1_id", null: false
    t.integer "user_2_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "workspace_id", null: false
    t.boolean "active_1", default: false
    t.boolean "active_2", default: false
    t.boolean "starred_1", default: false
    t.boolean "starred_2", default: false
    t.index ["channel_id"], name: "index_dm_channel_users_on_channel_id", unique: true
    t.index ["user_1_id", "user_2_id"], name: "index_dm_channel_users_on_user_1_id_and_user_2_id", unique: true
    t.index ["user_1_id"], name: "index_dm_channel_users_on_user_1_id"
    t.index ["user_2_id"], name: "index_dm_channel_users_on_user_2_id"
  end

  create_table "message_reacts", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "message_id", null: false
    t.string "react_code", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["message_id"], name: "index_message_reacts_on_message_id"
    t.index ["user_id"], name: "index_message_reacts_on_user_id"
  end

  create_table "message_saves", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "message_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "workspace_id", null: false
    t.index ["message_id"], name: "index_message_saves_on_message_id"
    t.index ["user_id", "message_id"], name: "index_message_saves_on_user_id_and_message_id", unique: true
    t.index ["user_id"], name: "index_message_saves_on_user_id"
  end

  create_table "messages", force: :cascade do |t|
    t.text "body", null: false
    t.integer "user_id", null: false
    t.integer "channel_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["channel_id"], name: "index_messages_on_channel_id"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "session_token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "full_name", null: false
    t.string "display_name", null: false
    t.string "phone_number", null: false
    t.string "what_i_do", null: false
    t.integer "timezone_offset", default: 0
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["session_token"], name: "index_users_on_session_token", unique: true
  end

  create_table "workspace_users", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "workspace_id", null: false
    t.boolean "logged_in", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "active", default: true
    t.boolean "paused", default: false
    t.string "status", default: ""
    t.index ["user_id", "workspace_id"], name: "index_workspace_users_on_user_id_and_workspace_id", unique: true
    t.index ["user_id"], name: "index_workspace_users_on_user_id"
    t.index ["workspace_id"], name: "index_workspace_users_on_workspace_id"
  end

  create_table "workspaces", force: :cascade do |t|
    t.string "address", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["address"], name: "index_workspaces_on_address", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
end
