export type Locale = 'ja' | 'vi' | 'en';

export const localeNames: Record<Locale, string> = {
  ja: '日本語',
  vi: 'Tiếng Việt',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  ja: '🇯🇵',
  vi: '🇻🇳',
  en: '🇬🇧',
};

type TranslationKeys = {
  search_tags: string[];
  search_tags_title: string;
  search_tags_subtitle: string;

  // Nav
  nav_home: string;
  nav_saved: string;
  nav_bookings: string;
  nav_profile: string;
  nav_search: string;
  nav_favorites: string;
  nav_reservations: string;
  nav_settings: string;

  // Home
  home_title: string;
  home_subtitle: string;
  home_map_btn: string;
  home_login_btn: string;
  home_featured: string;
  home_jp_ok: string;
  home_clean: string;
  home_search_title: string;
  home_search_placeholder: string;
  home_search_btn: string;
  home_tab_list: string;
  home_tab_map: string;
  home_filter_price: string;
  home_filter_rating: string;
  home_filter_category: string;
  home_recommended: string;
  home_cuisine_desc: string;

  // Landing
  landing_hero_title: string;
  landing_hero_subtitle: string;
  landing_cta_explore: string;
  landing_cta_login: string;
  landing_feat1_title: string;
  landing_feat1_desc: string;
  landing_feat2_title: string;
  landing_feat2_desc: string;
  landing_feat3_title: string;
  landing_feat3_desc: string;
  landing_section_features: string;
  landing_section_popular: string;
  landing_view_all: string;
  landing_ready_title: string;
  landing_ready_subtitle: string;

  // Auth
  auth_welcome_back: string;
  auth_login: string;
  auth_register: string;
  auth_email: string;
  auth_password: string;
  auth_name: string;
  auth_phone: string;
  auth_confirm_password: string;
  auth_forgot_password: string;
  auth_no_account: string;
  auth_has_account: string;
  auth_register_now: string;
  auth_owner_portal: string;
  auth_owner_login: string;
  auth_owner_register: string;
  auth_restaurant_name: string;

  // Profile
  profile_title: string;
  profile_personal_info: string;
  profile_saved_list: string;
  profile_change_password: string;
  profile_search_history: string;
  profile_logout: string;
  profile_reviews: string;
  profile_bookings: string;
  profile_account_settings: string;
  profile_premium: string;

  // Restaurant
  restaurant_features: string;
  restaurant_menu: string;
  restaurant_reviews: string;
  restaurant_owner: string;
  restaurant_reservation: string;
  restaurant_reserve_btn: string;
  restaurant_clean: string;
  restaurant_jp_menu: string;
  restaurant_air_con: string;
  restaurant_jp_staff: string;
  restaurant_no_menu: string;
  restaurant_no_reviews: string;
  restaurant_accepting: string;
  restaurant_details: string;

  // Map
  map_search_placeholder: string;
  map_map_tab: string;
  map_restaurants_tab: string;
  map_featured_tab: string;
  map_available: string;
  map_full: string;
  map_waitlist: string;
  map_hello: string;
  map_hungry: string;
  map_reserve_btn: string;

  // Bookings
  bookings_title: string;
  bookings_subtitle: string;
  bookings_empty: string;
  bookings_empty_sub: string;
  bookings_find: string;
  bookings_confirmed: string;
  bookings_waiting: string;
  bookings_cancelled: string;
  bookings_cancel_btn: string;
  bookings_cancel_confirm: string;
  bookings_guests: string;
  bookings_loading: string;

  // Saved
  saved_title: string;
  saved_empty: string;
  saved_empty_sub: string;
  saved_find: string;

  // Search History
  history_title: string;
  history_clear_all: string;
  history_empty: string;
  history_empty_sub: string;

  // Change Password
  change_pw_title: string;
  change_pw_current: string;
  change_pw_new: string;
  change_pw_confirm: string;
  change_pw_requirements: string;
  change_pw_btn: string;
  change_pw_back: string;
  change_pw_subtitle: string;

  // Owner
  owner_dashboard: string;
  owner_menu: string;
  owner_promotions: string;
  owner_reservations: string;
  owner_chat: string;
  owner_panel: string;

  // Auth extra
  auth_login_subtitle: string;
  auth_register_start: string;
  auth_register_create: string;
  auth_register_welcome: string;
  auth_register_terms: string;
  auth_register_terms_sub: string;
  auth_register_btn: string;
  auth_owner_email: string;
  auth_owner_register_label: string;
  auth_owner_register_subtitle: string;
  auth_owner_register_btn: string;
  auth_owner_name: string;
  auth_owner_manage: string;
  auth_owner_no_account: string;
  auth_owner_has_account: string;
  auth_owner_left_title: string;
  auth_owner_left_sub: string;
  auth_register_left_title: string;
  auth_register_left_sub: string;
  auth_user_login: string;
  auth_user_register_label: string;
  auth_owner_login_label: string;
  auth_google_soon: string;
  auth_fb_soon: string;
  auth_email_label: string;

  // Personal info extra
  personal_info_email_note: string;
  personal_info_subtitle: string;

  // Saved extra
  saved_page_title: string;
  saved_page_subtitle: string;
  saved_filter_rating: string;
  saved_filter_distance: string;
  saved_filter_seats: string;
  saved_filter_btn: string;
  saved_available: string;
  saved_full: string;

  // Profile subtitles
  profile_personal_info_sub: string;
  profile_saved_list_sub: string;
  profile_change_password_sub: string;
  profile_search_history_sub: string;
  profile_logout_sub: string;
  profile_reviews_label: string;
  profile_bookings_label: string;
  profile_settings_label: string;
  profile_premium_label: string;

  // Booking extra
  booking_reserve_now: string;
  history_clear_confirm: string;

  // Common
  common_loading: string;
  common_save: string;
  common_cancel: string;
  common_delete: string;
  common_edit: string;
  common_back: string;
  common_submit: string;
  common_search: string;

  // Extra strings for owner, map, restaurant details
  profile_role_admin: string;
  sidebar_view_public: string;

  owner_stat_total_res: string;
  owner_stat_weekly_sales: string;
  owner_stat_menu_items: string;
  owner_stat_reviews: string;
  owner_promo_active_label: string;
  owner_promo_update: string;
  owner_recent_res_title: string;
  owner_recent_res_view_all: string;
  owner_recent_res_empty: string;
  owner_recent_res_empty_sub: string;
  owner_info_title: string;
  owner_info_address: string;
  owner_info_hours: string;
  owner_info_categories: string;
  owner_info_max_seats: string;
  owner_info_seats_unit: string;
  owner_info_not_set: string;
  owner_info_edit_btn: string;

  owner_menu_add_btn: string;
  owner_menu_list_title: string;
  owner_menu_empty: string;
  owner_menu_empty_sub: string;
  owner_menu_col_name: string;
  owner_menu_col_ingredients: string;
  owner_menu_col_price: string;
  owner_menu_col_actions: string;
  owner_menu_delete_title: string;
  owner_menu_delete_warning: string;

  menu_form_edit_title: string;
  menu_form_add_title: string;
  menu_form_name_vn: string;
  menu_form_name_jp: string;
  menu_form_ingredients: string;
  menu_form_price: string;
  menu_form_image_url: string;
  menu_form_btn_add: string;
  menu_form_btn_update: string;
  menu_form_btn_saving: string;

  owner_promo_list_title: string;
  owner_promo_add_btn: string;
  owner_promo_empty: string;
  owner_promo_empty_sub: string;
  owner_promo_status_active: string;
  owner_promo_status_ended: string;
  owner_promo_delete_title: string;

  promo_form_edit_title: string;
  promo_form_add_title: string;
  promo_form_title_label: string;
  promo_form_desc_label: string;
  promo_form_discount_label: string;
  promo_form_status_label: string;
  promo_form_status_active: string;
  promo_form_status_inactive: string;
  promo_form_start_date: string;
  promo_form_end_date: string;
  promo_form_menu_label: string;
  promo_form_menu_all: string;
  promo_form_btn_add: string;

  owner_res_tab_all: string;
  owner_res_tab_waiting: string;
  owner_res_tab_confirmed: string;
  owner_res_tab_cancelled: string;
  owner_res_empty: string;
  owner_res_empty_sub: string;
  owner_res_col_customer: string;
  owner_res_col_contact: string;
  owner_res_col_datetime: string;
  owner_res_col_guests: string;
  owner_res_col_status: string;
  owner_res_status_waiting: string;
  owner_res_status_confirmed: string;
  owner_res_status_cancelled: string;
  owner_res_action_confirm: string;
  owner_res_action_reject: string;

  search_popular_searches: string;
  search_popular_categories: string;
  search_recent_searches: string;
  search_delete_history: string;
  search_view_all_history: string;

  booking_modal_login_req: string;
  booking_modal_date_req: string;
  booking_modal_future_req: string;
  booking_modal_fail: string;
  booking_modal_network_err: string;
  booking_modal_success_title: string;
  booking_modal_success_desc1: string;
  booking_modal_success_desc2: string;
  booking_modal_view_list: string;
  booking_modal_close: string;
  booking_modal_title: string;
  booking_modal_date: string;
  booking_modal_time: string;
  booking_modal_guests: string;
  booking_modal_max_seats: string;
  booking_modal_submit: string;
  booking_modal_submitting: string;

  map_loading: string;

  rest_community_rec: string;
  rest_contact: string;
  rest_details_title: string;
  rest_seasonal_menu: string;
  rest_trust_reviews: string;
  rest_reviews_count: string;
  rest_hours: string;
  rest_budget: string;
  rest_status_open: string;
  rest_status_closed: string;
  rest_dining_info: string;

  auth_processing: string;
  auth_or_continue: string;
  auth_google_err: string;
  auth_google_fail: string;
  auth_facebook_err: string;
  auth_facebook_fail: string;
  auth_facebook_config_missing: string;
  auth_provider_soon: string;

  validation_email_req: string;
  validation_email_invalid: string;
  validation_password_req: string;
  validation_password_min: string;
  validation_name_min: string;
  validation_phone_req: string;
  validation_confirm_req: string;
  validation_match: string;
  validation_res_name_req: string;
  validation_alpha: string;
  validation_number: string;

  search_recent_item_cat: string;
  search_recent_item_loc: string;
  search_recent_item_time_min: string;
  search_recent_item_time_hour: string;
  search_recent_item_time_yesterday: string;

  promo_placeholder_title: string;
  promo_placeholder_desc: string;
  menu_placeholder_name: string;
  menu_placeholder_ingredients: string;
  auth_name_placeholder: string;
  auth_owner_name_placeholder: string;
  auth_res_placeholder: string;
  auth_phone_placeholder: string;

  nav_terms: string;
  nav_privacy: string;
  terms_title: string;
  terms_subtitle: string;
  terms_agree_btn: string;
  terms_download_btn: string;
  terms_updated_at: string;

  rest_placeholder_subtitle: string;
  rest_placeholder_desc: string;
  rest_review_author_loc: string;
  rest_review_placeholder: string;
  rest_info_allergy: string;
  rest_info_vege: string;
  rest_info_halal: string;

  owner_dashboard_title: string;
  common_today: string;
  common_tomorrow: string;
  owner_res_guests_label: string;

  owner_chat_title: string;
  owner_chat_search_placeholder: string;
  owner_chat_list_title: string;
  owner_chat_list_empty: string;
  owner_chat_select_prompt: string;
  owner_chat_select_sub: string;
  owner_chat_online: string;
  owner_chat_typing: string;
  owner_chat_input_placeholder: string;
  owner_chat_send: string;
  owner_chat_no_messages: string;
  owner_chat_items_count: string;
  owner_chat_user_suffix: string;
  chat_edit: string;
  chat_save_edit: string;
  chat_cancel_edit: string;
  chat_retract: string;
  chat_retracted: string;
  chat_edited: string;
  chat_retract_confirm: string;

  bookings_not_found: string;
  bookings_back_to_list: string;
  bookings_wait_confirmation: string;
  bookings_chat_empty_sub: string;
};

import jaTranslations from '../locales/ja.json';
import viTranslations from '../locales/vi.json';
import enTranslations from '../locales/en.json';

const translations: Record<Locale, TranslationKeys> = {
  ja: jaTranslations as TranslationKeys,
  vi: viTranslations as TranslationKeys,
  en: enTranslations as TranslationKeys,
};

export function getTranslations(locale: Locale): TranslationKeys {
  return translations[locale];
}

export function t(locale: Locale, key: keyof TranslationKeys): string {
  return translations[locale][key] || translations['ja'][key] || key;
}
