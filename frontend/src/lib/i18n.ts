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
  promo_form_btn_add: string;

  owner_res_tab_all: string;
  owner_res_empty: string;
  owner_res_empty_sub: string;
  owner_res_col_customer: string;
  owner_res_col_datetime: string;
  owner_res_col_guests: string;
  owner_res_col_status: string;
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

  bookings_not_found: string;
  bookings_back_to_list: string;
  bookings_wait_confirmation: string;
  bookings_chat_empty_sub: string;
};

const translations: Record<Locale, TranslationKeys> = {
  ja: {
    nav_home: 'ホーム',
    nav_saved: '保存済み',
    nav_bookings: '予約管理',
    nav_profile: 'プロフィール',
    nav_search: '検索',
    nav_favorites: 'お気に入り',
    nav_reservations: '予約',
    nav_settings: '設定',

    home_title: 'ベトナム料理を、\nもっと身近に。',
    home_subtitle: 'VietDineは、ハノイの日本人コミュニティによって認証された、安心・安全なベトナムレストランを探せるサービスです。',
    home_map_btn: '地図から探す',
    home_login_btn: 'ログインして保存',
    home_featured: '日本人コミュニティ認証済みの人気店',
    home_jp_ok: '日本語OK',
    home_clean: '清潔感高',
    home_search_title: 'レストランを検索',
    home_search_placeholder: '何をお探しですか？',
    home_search_btn: '検索',
    home_tab_list: 'リスト',
    home_tab_map: '地図',
    home_filter_price: '価格',
    home_filter_rating: '評価',
    home_filter_category: 'カテゴリー',
    home_recommended: 'おすすめ',
    home_cuisine_desc: '本格和食・寿司',

    landing_hero_title: 'ベトナムの美食探求、\nここから始まる。',
    landing_hero_subtitle: 'ハノイの日本人コミュニティが厳選した、安心・安全で本格的なベトナム料理店をご紹介します。',
    landing_cta_explore: 'レストランを探す',
    landing_cta_login: 'ログイン・登録',
    landing_feat1_title: '厳選された店舗',
    landing_feat1_desc: '日本人駐在員による厳しい評価基準をクリアした、清潔で美味しいお店のみを掲載。',
    landing_feat2_title: '日本語サポート',
    landing_feat2_desc: '日本語メニューの有無や、日本語対応可能なスタッフがいる店舗がひと目でわかります。',
    landing_feat3_title: '簡単・確実な予約',
    landing_feat3_desc: 'アプリから簡単に席を予約。店舗との直接チャットで細かな要望も伝えられます。',
    landing_section_features: 'VietDineが選ばれる理由',
    landing_section_popular: '人気のレストラン',
    landing_view_all: 'すべて見る',
    landing_ready_title: 'さあ、新しい食の体験へ。',
    landing_ready_subtitle: 'VietDineで、ハノイの隠れた名店を見つけましょう。',

    auth_welcome_back: 'おかえりなさい。',
    auth_login: 'ログイン',
    auth_register: '新規登録する',
    auth_email: 'メールアドレスまたは電話番号',
    auth_password: 'パスワード',
    auth_name: 'お名前',
    auth_phone: '電話番号',
    auth_confirm_password: 'パスワード（確認用）',
    auth_forgot_password: 'パスワードをお忘れですか？',
    auth_no_account: 'アカウントをお持ちでないですか？',
    auth_has_account: 'すでにアカウントをお持ちですか？',
    auth_register_now: '今すぐ新規登録',
    auth_owner_portal: 'Owner Portal',
    auth_owner_login: '店舗管理へようこそ。',
    auth_owner_register: '店舗アカウント作成',
    auth_restaurant_name: 'レストラン名',

    profile_title: 'プロフィール',
    profile_personal_info: '個人情報',
    profile_saved_list: '保存済みリスト',
    profile_change_password: 'パスワード変更',
    profile_search_history: '検索履歴',
    profile_logout: 'ログアウト',
    profile_reviews: 'レビュー',
    profile_bookings: '予約',
    profile_account_settings: 'アカウント設定',
    profile_premium: 'プレミアム会員',

    restaurant_features: '店舗の特徴',
    restaurant_menu: 'メニュー',
    restaurant_reviews: 'レビュー',
    restaurant_owner: 'オーナー情報',
    restaurant_reservation: '予約',
    restaurant_reserve_btn: 'テーブルを予約する',
    restaurant_clean: '清潔感高',
    restaurant_jp_menu: '日本語メニュー',
    restaurant_air_con: 'エアコン',
    restaurant_jp_staff: '日本語対応スタッフ',
    restaurant_no_menu: 'メニュー情報がありません',
    restaurant_no_reviews: 'まだレビューがありません',
    restaurant_accepting: 'このレストランは予約を受け付けています。',
    restaurant_details: '詳細を見る',

    map_search_placeholder: 'ハノイのレストランを検索...',
    map_map_tab: 'マップ',
    map_restaurants_tab: 'レストラン',
    map_featured_tab: '特集',
    map_available: '空席あり',
    map_full: '本日満席',
    map_waitlist: 'キャンセル待ち',
    map_hello: 'こんにちは',
    map_hungry: 'お腹が空きましたか？',
    map_reserve_btn: 'テーブルを予約する',

    bookings_title: '予約管理',
    bookings_subtitle: 'あなたの予約一覧と店舗とのチャットを確認できます',
    bookings_empty: '予約がありません',
    bookings_empty_sub: 'レストランを探して予約してみましょう',
    bookings_find: 'レストランを探す',
    bookings_confirmed: '確定済み',
    bookings_waiting: '確認待ち',
    bookings_cancelled: 'キャンセル',
    bookings_cancel_btn: 'キャンセル',
    bookings_cancel_confirm: '予約をキャンセルしますか？',
    bookings_guests: '名',
    bookings_loading: '読み込み中...',

    saved_title: '保存済みリスト',
    saved_empty: '保存されたレストランがありません',
    saved_empty_sub: 'お気に入りのレストランを見つけて、保存アイコンをタップするとここに追加されます。',
    saved_find: 'レストランを探す',

    history_title: '検索履歴',
    history_clear_all: 'すべて削除',
    history_empty: '検索履歴がありません',
    history_empty_sub: 'レストランを検索すると、ここに履歴が表示されます。',

    change_pw_title: 'パスワード変更',
    change_pw_current: '現在のパスワード',
    change_pw_new: '新しいパスワード',
    change_pw_confirm: '新しいパスワード（確認用）',
    change_pw_requirements: 'パスワード要件:',
    change_pw_btn: 'パスワードを変更',
    change_pw_back: '← プロフィールに戻る',
    change_pw_subtitle: 'アカウントのセキュリティを保護します',

    owner_dashboard: 'ダッシュボード',
    owner_menu: 'メニュー管理',
    owner_promotions: 'プロモーション',
    owner_reservations: '予約管理',
    owner_chat: 'チャット',
    owner_panel: 'オーナー管理パネル',

    auth_login_subtitle: '禅の精神を込めた美食体験',
    auth_register_start: '今すぐ始める',
    auth_register_create: 'アカウント作成',
    auth_register_welcome: 'VietDineコミュニティへようこそ。',
    auth_register_terms: '利用規約およびプライバシーポリシーに同意します。',
    auth_register_terms_sub: 'ベトナム在住の日本人ユーザー向けの規約に同意します。',
    auth_register_btn: '新規登録する',
    auth_owner_email: 'オーナーメールアドレス',
    auth_owner_register_label: 'オーナー登録',
    auth_owner_register_subtitle: 'VietDineでビジネスを始めましょう。',
    auth_owner_register_btn: 'オーナー登録する',
    auth_owner_name: 'オーナー名',
    auth_owner_manage: 'あなたのレストランを最適に管理しましょう',
    auth_owner_no_account: 'オーナーアカウントをお持ちでないですか？',
    auth_owner_has_account: 'すでにオーナーアカウントをお持ちですか？',
    auth_owner_left_title: 'ビジネスを\n成長させよう。',
    auth_owner_left_sub: '日本人コミュニティに直接アプローチし、あなたのレストランを最大限にアピールしましょう。',
    auth_register_left_title: '洗練された\n美食の旅へ。',
    auth_register_left_sub: 'ベトナム料理の真髄を追求する、日本人駐在員と美食家のための限定コミュニティへようこそ。',
    auth_user_login: 'ユーザーログイン',
    auth_google_soon: 'Google登録は近日公開予定です',
    auth_fb_soon: 'Facebook登録は近日公開予定です',
    auth_email_label: 'メールアドレス',

    personal_info_email_note: 'メールアドレスは変更できません',
    personal_info_subtitle: 'PERSONAL INFORMATION / 個人情報',

    saved_page_title: '保存したレストラン',
    saved_page_subtitle: '保存したカフェ・飲食店',
    saved_filter_rating: '評価',
    saved_filter_distance: '距離',
    saved_filter_seats: '空席状況',
    saved_filter_btn: 'フィルター',
    saved_available: '空席あり',
    saved_full: '満席',

    profile_personal_info_sub: '個人情報の確認・変更',
    profile_saved_list_sub: 'お気に入り店舗の管理',
    profile_change_password_sub: 'セキュリティ設定',
    profile_search_history_sub: '過去の検索履歴',
    profile_logout_sub: 'アカウントからログアウト',
    profile_reviews_label: 'レビュー',
    profile_bookings_label: '予約',
    profile_settings_label: 'アカウント設定',
    profile_premium_label: 'Premium Member',

    booking_reserve_now: '今すぐ予約する',
    history_clear_confirm: 'すべての検索履歴を削除しますか？',

    common_loading: '読み込み中...',
    common_save: '保存',
    common_cancel: 'キャンセル',
    common_delete: '削除',
    common_edit: '編集',
    common_back: '戻る',
    common_submit: '送信',
    common_search: '検索',

    profile_role_admin: 'レストラン管理者',
    sidebar_view_public: '公開ページを表示',

    owner_stat_total_res: '総予約数',
    owner_stat_weekly_sales: '週次売上',
    owner_promo_active_label: '実施中のプロモーション',
    owner_promo_update: '更新する',
    owner_recent_res_title: '最近の予約',
    owner_recent_res_view_all: 'すべて表示',
    owner_recent_res_empty: '予約はまだありません',
    owner_recent_res_empty_sub: '新しい予約が入ると、ここに表示されます',
    owner_info_title: '店舗情報',
    owner_info_address: '所在地',
    owner_info_hours: '営業時間',
    owner_info_categories: '料理カテゴリー',
    owner_info_max_seats: '最大席数',
    owner_info_seats_unit: '席',
    owner_info_not_set: '未設定',
    owner_info_edit_btn: 'プロフィール詳細を編集',

    owner_menu_add_btn: '新しいメニューを追加',
    owner_menu_list_title: 'メニュー一覧（{count}品）',
    owner_menu_empty: 'メニューがまだありません',
    owner_menu_empty_sub: '「新しいメニューを追加」ボタンから最初のメニューを作成しましょう',
    owner_menu_col_name: '料理名',
    owner_menu_col_ingredients: '原材料',
    owner_menu_col_price: '価格',
    owner_menu_col_actions: '操作',
    owner_menu_delete_title: 'メニューを削除しますか？',
    owner_menu_delete_warning: 'この操作は取り消せません。',

    menu_form_edit_title: 'メニュー編集',
    menu_form_add_title: '新しいメニューを追加',
    menu_form_name_vn: '料理名（ベトナム語）',
    menu_form_name_jp: '料理名（日本語）',
    menu_form_ingredients: '原材料・食材',
    menu_form_price: '価格（VND）',
    menu_form_image_url: '画像URL',
    menu_form_btn_add: '追加する',
    menu_form_btn_update: '更新する',
    menu_form_btn_saving: '保存中...',

    owner_promo_list_title: '全{count}件のプロモーション',
    owner_promo_add_btn: '新しいプロモーション',
    owner_promo_empty: 'プロモーションがまだありません',
    owner_promo_empty_sub: 'お客様を引き付けるキャンペーンを作成しましょう',
    owner_promo_status_active: '実施中',
    owner_promo_status_ended: '終了',
    owner_promo_delete_title: 'プロモーションを削除しますか？',

    promo_form_edit_title: 'プロモーション編集',
    promo_form_add_title: '新しいプロモーションを作成',
    promo_form_title_label: 'タイトル',
    promo_form_desc_label: '説明',
    promo_form_discount_label: '割引率（%）',
    promo_form_status_label: 'ステータス',
    promo_form_status_active: '有効',
    promo_form_status_inactive: '無効',
    promo_form_start_date: '開始日',
    promo_form_end_date: '終了日',
    promo_form_btn_add: '作成する',

    owner_res_tab_all: 'すべて',
    owner_res_empty: '予約がありません',
    owner_res_empty_sub: '該当する予約がまだありません',
    owner_res_col_customer: 'お客様',
    owner_res_col_datetime: '日時',
    owner_res_col_guests: '人数',
    owner_res_col_status: 'ステータス',
    owner_res_action_confirm: '確認する',
    owner_res_action_reject: '拒否',

    search_popular_searches: '人気の検索',
    search_popular_categories: '人気のカテゴリー',
    search_recent_searches: '最近の検索',
    search_delete_history: '削除',
    search_view_all_history: 'すべての履歴を見る',

    booking_modal_login_req: '予約するにはログインが必要です',
    booking_modal_date_req: '日付と時間を選択してください',
    booking_modal_future_req: '予約日時は未来の日時を指定してください',
    booking_modal_fail: '予約に失敗しました',
    booking_modal_network_err: '通信エラーが発生しました',
    booking_modal_success_title: '予約を受け付けました',
    booking_modal_success_desc1: 'への予約リクエストが送信されました。',
    booking_modal_success_desc2: '店舗からの確認をお待ちください。',
    booking_modal_view_list: '予約一覧を確認',
    booking_modal_close: '閉じる',
    booking_modal_title: '予約する',
    booking_modal_date: '日付',
    booking_modal_time: '時間',
    booking_modal_guests: '人数',
    booking_modal_max_seats: '最大{max}席まで',
    booking_modal_submit: '予約を確定する',
    booking_modal_submitting: '送信中...',

    map_loading: '地図を読み込み中...',

    rest_community_rec: 'コミュニティ推薦店',
    rest_contact: 'お問い合わせ',
    rest_details_title: '店舗詳細',
    rest_seasonal_menu: '季節の献立',
    rest_trust_reviews: '信頼と評価',
    rest_reviews_count: '{count}件のレビュー',
    rest_hours: '営業時間',
    rest_budget: '予算',
    rest_status_open: '営業中',
    rest_status_closed: '準備中',
    rest_dining_info: 'お食事の情報',

    auth_processing: '処理中...',
    auth_or_continue: 'または次で続ける',
    auth_google_err: 'Googleログイン中にエラーが発生しました。',
    auth_google_fail: 'Googleログインに失敗しました。',
    auth_provider_soon: '{provider}ログインは近日公開予定です',

    validation_email_req: 'メールアドレスを入力してください',
    validation_email_invalid: '有効なメールアドレスを入力してください',
    validation_password_req: 'パスワードを入力してください',
    validation_password_min: 'パスワードは8文字以上で入力してください',
    validation_name_min: '名前は2文字以上で入力してください',
    validation_phone_req: '電話番号を入力してください',
    validation_confirm_req: 'パスワード（確認用）を入力してください',
    validation_match: 'パスワードが一致しません',
    validation_res_name_req: 'レストラン名を入力してください',
    validation_alpha: 'アルファベットを含めてください',
    validation_number: '数字を含めてください',

    search_recent_item_cat: 'カテゴリー',
    search_recent_item_loc: '場所',
    search_recent_item_time_min: '{count}分前',
    search_recent_item_time_hour: '{count}時間前',
    search_recent_item_time_yesterday: '昨日',

    promo_placeholder_title: 'サンセットディナー特別プラン',
    promo_placeholder_desc: 'キャンペーンの詳細を入力...',
    menu_placeholder_name: '牛肉フォー',
    menu_placeholder_ingredients: '米麺、牛肉、ハーブ、スパイス...',
    auth_name_placeholder: '例：山田 太郎',
    auth_owner_name_placeholder: '例：佐藤 花子',
    auth_res_placeholder: '例：フォー・ハノイ',
    auth_phone_placeholder: '090 1234 5678',

    nav_terms: '利用規約',
    nav_privacy: 'プライバシーポリシー',
    terms_title: '利用規約',
    terms_subtitle: 'VietDineをご利用いただきありがとうございます。本規約は、当サービスの利用条件を定めるものです。',
    terms_agree_btn: '同意して登録に戻る',
    terms_download_btn: 'PDFでダウンロード',
    terms_updated_at: '最終更新日：{date}',

    rest_placeholder_subtitle: '本格懐石料理の体験',
    rest_placeholder_desc: '京都ガーデンは、ハノイの中心部で本格的な懐石料理の神髄をお届けします。禅の精神に基づいた空間で、四季折々の食材を活かした芸術的な一皿をお楽しみください。',
    rest_review_author_loc: 'ハノイ在住',
    rest_review_placeholder: 'ハノイで最も本物に近い懐石料理。素材の扱いが非常に丁寧で、日本にいるような錯覚を覚えます。',
    rest_info_allergy: 'アレルギー表示あり（卵・乳・小麦）。',
    rest_info_vege: 'ベジタリアン対応可（24時間前までの要予約）。',
    rest_info_halal: 'ハラール対応オプションあり。',

    owner_dashboard_title: 'オーナー管理パネル',
    common_today: '本日',
    common_tomorrow: '明日',
    owner_res_guests_label: '{count}名様',

    owner_chat_title: '予約・チャット管理',
    owner_chat_search_placeholder: '予約番号、または顧客名で検索',
    owner_chat_list_title: '予約一覧',
    owner_chat_list_empty: '予約がありません',
    owner_chat_select_prompt: 'チャットを選択',
    owner_chat_select_sub: '左側の予約一覧からチャットを開始してください',
    owner_chat_online: 'オンライン',
    owner_chat_typing: '入力中...',
    owner_chat_input_placeholder: 'メッセージを入力...',
    owner_chat_send: '送信',
    owner_chat_no_messages: 'まだメッセージがありません',
    owner_chat_items_count: '{count}件',
    owner_chat_user_suffix: '様',

    bookings_not_found: '予約が見つかりません',
    bookings_back_to_list: '予約一覧に戻る',
    bookings_wait_confirmation: '確認待ち',
    bookings_chat_empty_sub: 'お店に質問や要望を送りましょう。',
  },

  vi: {
    nav_home: 'Trang chủ',
    nav_saved: 'Đã lưu',
    nav_bookings: 'Đặt bàn',
    nav_profile: 'Hồ sơ',
    nav_search: 'Tìm kiếm',
    nav_favorites: 'Yêu thích',
    nav_reservations: 'Đặt chỗ',
    nav_settings: 'Cài đặt',

    home_title: 'Ẩm thực Việt Nam,\ngần hơn bao giờ hết.',
    home_subtitle: 'VietDine giúp bạn tìm kiếm các nhà hàng Việt Nam an toàn, được cộng đồng người Nhật tại Hà Nội xác nhận.',
    home_map_btn: 'Tìm trên bản đồ',
    home_login_btn: 'Đăng nhập để lưu',
    home_featured: 'Nhà hàng phổ biến được cộng đồng xác nhận',
    home_jp_ok: 'Có tiếng Nhật',
    home_clean: 'Sạch sẽ',
    home_search_title: 'Tìm kiếm nhà hàng',
    home_search_placeholder: 'Bạn đang tìm gì?',
    home_search_btn: 'Tìm kiếm',
    home_tab_list: 'Danh sách',
    home_tab_map: 'Bản đồ',
    home_filter_price: 'Giá',
    home_filter_rating: 'Đánh giá',
    home_filter_category: 'Thể loại',
    home_recommended: 'Đề xuất',
    home_cuisine_desc: 'Ẩm thực Nhật Bản chính thống',

    landing_hero_title: 'Khám phá ẩm thực\nViệt Nam đích thực.',
    landing_hero_subtitle: 'Khám phá những nhà hàng Việt Nam an toàn, chất lượng được cộng đồng người Nhật tại Hà Nội đánh giá và lựa chọn.',
    landing_cta_explore: 'Khám phá nhà hàng',
    landing_cta_login: 'Đăng nhập / Đăng ký',
    landing_feat1_title: 'Nhà hàng chọn lọc',
    landing_feat1_desc: 'Chỉ hiển thị những nhà hàng sạch sẽ, ngon miệng đạt tiêu chuẩn của người Nhật.',
    landing_feat2_title: 'Hỗ trợ tiếng Nhật',
    landing_feat2_desc: 'Dễ dàng nhận biết nhà hàng có menu tiếng Nhật hay nhân viên biết tiếng Nhật.',
    landing_feat3_title: 'Đặt bàn dễ dàng',
    landing_feat3_desc: 'Đặt bàn nhanh chóng qua ứng dụng. Trò chuyện trực tiếp với nhà hàng để yêu cầu thêm.',
    landing_section_features: 'Tại sao chọn VietDine',
    landing_section_popular: 'Nhà hàng nổi bật',
    landing_view_all: 'Xem tất cả',
    landing_ready_title: 'Sẵn sàng trải nghiệm?',
    landing_ready_subtitle: 'Hãy cùng VietDine tìm kiếm những quán ăn tuyệt vời tại Hà Nội.',

    auth_welcome_back: 'Chào mừng trở lại.',
    auth_login: 'Đăng nhập',
    auth_register: 'Đăng ký',
    auth_email: 'Email hoặc số điện thoại',
    auth_password: 'Mật khẩu',
    auth_name: 'Họ và tên',
    auth_phone: 'Số điện thoại',
    auth_confirm_password: 'Xác nhận mật khẩu',
    auth_forgot_password: 'Quên mật khẩu?',
    auth_no_account: 'Chưa có tài khoản?',
    auth_has_account: 'Đã có tài khoản?',
    auth_register_now: 'Đăng ký ngay',
    auth_owner_portal: 'Cổng chủ quán',
    auth_owner_login: 'Chào mừng đến quản lý cửa hàng.',
    auth_owner_register: 'Tạo tài khoản cửa hàng',
    auth_restaurant_name: 'Tên nhà hàng',

    profile_title: 'Hồ sơ',
    profile_personal_info: 'Thông tin cá nhân',
    profile_saved_list: 'Danh sách đã lưu',
    profile_change_password: 'Đổi mật khẩu',
    profile_search_history: 'Lịch sử tìm kiếm',
    profile_logout: 'Đăng xuất',
    profile_reviews: 'Đánh giá',
    profile_bookings: 'Đặt bàn',
    profile_account_settings: 'Cài đặt tài khoản',
    profile_premium: 'Thành viên Premium',

    restaurant_features: 'Đặc điểm',
    restaurant_menu: 'Thực đơn',
    restaurant_reviews: 'Đánh giá',
    restaurant_owner: 'Thông tin chủ quán',
    restaurant_reservation: 'Đặt bàn',
    restaurant_reserve_btn: 'Đặt bàn ngay',
    restaurant_clean: 'Sạch sẽ',
    restaurant_jp_menu: 'Menu tiếng Nhật',
    restaurant_air_con: 'Điều hòa',
    restaurant_jp_staff: 'Nhân viên nói tiếng Nhật',
    restaurant_no_menu: 'Chưa có thông tin thực đơn',
    restaurant_no_reviews: 'Chưa có đánh giá nào',
    restaurant_accepting: 'Nhà hàng này đang nhận đặt bàn.',
    restaurant_details: 'Xem chi tiết',

    map_search_placeholder: 'Tìm nhà hàng tại Hà Nội...',
    map_map_tab: 'Bản đồ',
    map_restaurants_tab: 'Nhà hàng',
    map_featured_tab: 'Nổi bật',
    map_available: 'Còn chỗ',
    map_full: 'Hết chỗ hôm nay',
    map_waitlist: 'Danh sách chờ',
    map_hello: 'Xin chào',
    map_hungry: 'Bạn đói chưa?',
    map_reserve_btn: 'Đặt bàn ngay',

    bookings_title: 'Quản lý đặt bàn',
    bookings_subtitle: 'Xem danh sách đặt bàn và trò chuyện với nhà hàng',
    bookings_empty: 'Chưa có đặt bàn',
    bookings_empty_sub: 'Hãy tìm nhà hàng và đặt bàn nhé',
    bookings_find: 'Tìm nhà hàng',
    bookings_confirmed: 'Đã xác nhận',
    bookings_waiting: 'Chờ xác nhận',
    bookings_cancelled: 'Đã hủy',
    bookings_cancel_btn: 'Hủy',
    bookings_cancel_confirm: 'Bạn có muốn hủy đặt bàn không?',
    bookings_guests: 'khách',
    bookings_loading: 'Đang tải...',

    saved_title: 'Danh sách đã lưu',
    saved_empty: 'Chưa có nhà hàng nào được lưu',
    saved_empty_sub: 'Tìm nhà hàng yêu thích và nhấn biểu tượng lưu để thêm vào đây.',
    saved_find: 'Tìm nhà hàng',

    history_title: 'Lịch sử tìm kiếm',
    history_clear_all: 'Xóa tất cả',
    history_empty: 'Chưa có lịch sử tìm kiếm',
    history_empty_sub: 'Khi bạn tìm kiếm nhà hàng, lịch sử sẽ hiển thị ở đây.',

    change_pw_title: 'Đổi mật khẩu',
    change_pw_current: 'Mật khẩu hiện tại',
    change_pw_new: 'Mật khẩu mới',
    change_pw_confirm: 'Xác nhận mật khẩu mới',
    change_pw_requirements: 'Yêu cầu mật khẩu:',
    change_pw_btn: 'Đổi mật khẩu',
    change_pw_back: '← Quay lại hồ sơ',
    change_pw_subtitle: 'Bảo vệ bảo mật tài khoản của bạn',

    owner_dashboard: 'Bảng điều khiển',
    owner_menu: 'Quản lý menu',
    owner_promotions: 'Khuyến mãi',
    owner_reservations: 'Quản lý đặt bàn',
    owner_chat: 'Trò chuyện',
    owner_panel: 'Bảng quản lý chủ quán',

    auth_login_subtitle: 'Trải nghiệm ẩm thực tinh tế',
    auth_register_start: 'Bắt đầu ngay',
    auth_register_create: 'Tạo tài khoản',
    auth_register_welcome: 'Chào mừng đến cộng đồng VietDine.',
    auth_register_terms: 'Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật.',
    auth_register_terms_sub: 'Đồng ý với điều khoản dành cho người dùng tại Việt Nam.',
    auth_register_btn: 'Đăng ký',
    auth_owner_email: 'Email chủ quán',
    auth_owner_register_label: 'Đăng ký chủ quán',
    auth_owner_register_subtitle: 'Bắt đầu kinh doanh với VietDine.',
    auth_owner_register_btn: 'Đăng ký chủ quán',
    auth_owner_name: 'Tên chủ quán',
    auth_owner_manage: 'Quản lý nhà hàng của bạn một cách tối ưu',
    auth_owner_no_account: 'Chưa có tài khoản chủ quán?',
    auth_owner_has_account: 'Đã có tài khoản chủ quán?',
    auth_owner_left_title: 'Phát triển\nkinh doanh.',
    auth_owner_left_sub: 'Tiếp cận trực tiếp cộng đồng người Nhật và quảng bá nhà hàng của bạn tối đa.',
    auth_register_left_title: 'Hành trình\nẩm thực tinh tế.',
    auth_register_left_sub: 'Chào mừng đến cộng đồng dành cho người Nhật tại Việt Nam yêu thích ẩm thực Việt.',
    auth_user_login: 'Đăng nhập người dùng',
    auth_google_soon: 'Đăng ký Google sắp ra mắt',
    auth_fb_soon: 'Đăng ký Facebook sắp ra mắt',
    auth_email_label: 'Email',

    personal_info_email_note: 'Không thể thay đổi email',
    personal_info_subtitle: 'PERSONAL INFORMATION / THÔNG TIN CÁ NHÂN',

    saved_page_title: 'Nhà hàng đã lưu',
    saved_page_subtitle: 'Quán ăn & nhà hàng đã lưu',
    saved_filter_rating: 'Đánh giá',
    saved_filter_distance: 'Khoảng cách',
    saved_filter_seats: 'Tình trạng chỗ',
    saved_filter_btn: 'Bộ lọc',
    saved_available: 'Còn chỗ',
    saved_full: 'Hết chỗ',

    profile_personal_info_sub: 'Xem và thay đổi thông tin cá nhân',
    profile_saved_list_sub: 'Quản lý nhà hàng đã lưu',
    profile_change_password_sub: 'Thay đổi mật khẩu tài khoản',
    profile_search_history_sub: 'Xem lại các tìm kiếm gần đây',
    profile_logout_sub: 'Đăng xuất khỏi tài khoản',
    profile_reviews_label: 'ĐÁNH GIÁ',
    profile_bookings_label: 'ĐẶT BÀN',
    profile_settings_label: 'CÀI ĐẶT TÀI KHOẢN',
    profile_premium_label: 'Thành viên Premium',

    booking_reserve_now: 'Đặt bàn ngay',
    history_clear_confirm: 'Bạn có muốn xóa tất cả lịch sử tìm kiếm?',

    common_loading: 'Đang tải...',
    common_save: 'Lưu',
    common_cancel: 'Hủy',
    common_delete: 'Xóa',
    common_edit: 'Sửa',
    common_back: 'Quay lại',
    common_submit: 'Gửi',
    common_search: 'Tìm kiếm',

    profile_role_admin: 'Quản lý nhà hàng',
    sidebar_view_public: 'Xem trang công khai',

    owner_stat_total_res: 'Tổng lượt đặt',
    owner_stat_weekly_sales: 'Doanh thu tuần',
    owner_promo_active_label: 'Khuyến mãi đang chạy',
    owner_promo_update: 'Cập nhật',
    owner_recent_res_title: 'Đặt bàn gần đây',
    owner_recent_res_view_all: 'Xem tất cả',
    owner_recent_res_empty: 'Chưa có lượt đặt bàn nào',
    owner_recent_res_empty_sub: 'Các đặt bàn mới sẽ hiển thị tại đây',
    owner_info_title: 'Thông tin cửa hàng',
    owner_info_address: 'Địa chỉ',
    owner_info_hours: 'Giờ mở cửa',
    owner_info_categories: 'Danh mục món ăn',
    owner_info_max_seats: 'Số ghế tối đa',
    owner_info_seats_unit: 'ghế',
    owner_info_not_set: 'Chưa thiết lập',
    owner_info_edit_btn: 'Chỉnh sửa hồ sơ',

    owner_menu_add_btn: 'Thêm món mới',
    owner_menu_list_title: 'Danh sách thực đơn ({count} món)',
    owner_menu_empty: 'Chưa có thực đơn',
    owner_menu_empty_sub: 'Nhấn nút Thêm món mới để bắt đầu',
    owner_menu_col_name: 'Tên món',
    owner_menu_col_ingredients: 'Nguyên liệu',
    owner_menu_col_price: 'Giá',
    owner_menu_col_actions: 'Thao tác',
    owner_menu_delete_title: 'Xóa món ăn này?',
    owner_menu_delete_warning: 'Thao tác này không thể hoàn tác.',

    menu_form_edit_title: 'Sửa món ăn',
    menu_form_add_title: 'Thêm món mới',
    menu_form_name_vn: 'Tên món (Tiếng Việt)',
    menu_form_name_jp: 'Tên món (Tiếng Nhật)',
    menu_form_ingredients: 'Nguyên liệu',
    menu_form_price: 'Giá (VND)',
    menu_form_image_url: 'URL Hình ảnh',
    menu_form_btn_add: 'Thêm mới',
    menu_form_btn_update: 'Cập nhật',
    menu_form_btn_saving: 'Đang lưu...',

    owner_promo_list_title: 'Tất cả {count} khuyến mãi',
    owner_promo_add_btn: 'Khuyến mãi mới',
    owner_promo_empty: 'Chưa có khuyến mãi',
    owner_promo_empty_sub: 'Tạo chiến dịch để thu hút khách hàng',
    owner_promo_status_active: 'Đang chạy',
    owner_promo_status_ended: 'Đã kết thúc',
    owner_promo_delete_title: 'Xóa khuyến mãi này?',

    promo_form_edit_title: 'Sửa khuyến mãi',
    promo_form_add_title: 'Tạo khuyến mãi mới',
    promo_form_title_label: 'Tiêu đề',
    promo_form_desc_label: 'Mô tả',
    promo_form_discount_label: 'Phần trăm giảm (%)',
    promo_form_status_label: 'Trạng thái',
    promo_form_status_active: 'Kích hoạt',
    promo_form_status_inactive: 'Vô hiệu',
    promo_form_start_date: 'Ngày bắt đầu',
    promo_form_end_date: 'Ngày kết thúc',
    promo_form_btn_add: 'Tạo',

    owner_res_tab_all: 'Tất cả',
    owner_res_empty: 'Không có đặt bàn',
    owner_res_empty_sub: 'Không tìm thấy lượt đặt bàn nào',
    owner_res_col_customer: 'Khách hàng',
    owner_res_col_datetime: 'Thời gian',
    owner_res_col_guests: 'Số người',
    owner_res_col_status: 'Trạng thái',
    owner_res_action_confirm: 'Xác nhận',
    owner_res_action_reject: 'Từ chối',

    search_popular_searches: 'Tìm kiếm phổ biến',
    search_popular_categories: 'Danh mục phổ biến',
    search_recent_searches: 'Tìm kiếm gần đây',
    search_delete_history: 'Xóa',
    search_view_all_history: 'Xem tất cả lịch sử',

    booking_modal_login_req: 'Bạn cần đăng nhập để đặt bàn',
    booking_modal_date_req: 'Vui lòng chọn ngày và giờ',
    booking_modal_future_req: 'Vui lòng chọn thời gian trong tương lai',
    booking_modal_fail: 'Đặt bàn thất bại',
    booking_modal_network_err: 'Lỗi kết nối mạng',
    booking_modal_success_title: 'Đã tiếp nhận yêu cầu đặt bàn',
    booking_modal_success_desc1: 'Yêu cầu đặt bàn đến nhà hàng đã được gửi.',
    booking_modal_success_desc2: 'Vui lòng chờ xác nhận từ nhà hàng.',
    booking_modal_view_list: 'Xem danh sách đặt bàn',
    booking_modal_close: 'Đóng',
    booking_modal_title: 'Đặt bàn',
    booking_modal_date: 'Ngày',
    booking_modal_time: 'Giờ',
    booking_modal_guests: 'Số khách',
    booking_modal_max_seats: 'Tối đa {max} chỗ',
    booking_modal_submit: 'Xác nhận đặt bàn',
    booking_modal_submitting: 'Đang gửi...',

    map_loading: 'Đang tải bản đồ...',

    rest_community_rec: 'Đề xuất bởi cộng đồng',
    rest_contact: 'Liên hệ',
    rest_details_title: 'Chi tiết nhà hàng',
    rest_seasonal_menu: 'Thực đơn theo mùa',
    rest_trust_reviews: 'Đánh giá tin cậy',
    rest_reviews_count: '{count} đánh giá',
    rest_hours: 'Giờ mở cửa',
    rest_budget: 'Mức giá',
    rest_status_open: 'Đang mở cửa',
    rest_status_closed: 'Đóng cửa',
    rest_dining_info: 'Thông tin bữa ăn',

    auth_processing: 'Đang xử lý...',
    auth_or_continue: 'Hoặc tiếp tục với',
    auth_google_err: 'Có lỗi xảy ra khi đăng nhập Google.',
    auth_google_fail: 'Đăng nhập Google thất bại.',
    auth_provider_soon: 'Đăng nhập {provider} sẽ sớm ra mắt',

    validation_email_req: 'Vui lòng nhập email',
    validation_email_invalid: 'Email không hợp lệ',
    validation_password_req: 'Vui lòng nhập mật khẩu',
    validation_password_min: 'Mật khẩu phải ít nhất 8 ký tự',
    validation_name_min: 'Tên phải ít nhất 2 ký tự',
    validation_phone_req: 'Vui lòng nhập số điện thoại',
    validation_confirm_req: 'Vui lòng nhập lại mật khẩu',
    validation_match: 'Mật khẩu không khớp',
    validation_res_name_req: 'Vui lòng nhập tên nhà hàng',
    validation_alpha: 'Vui lòng bao gồm chữ cái',
    validation_number: 'Vui lòng bao gồm chữ số',

    search_recent_item_cat: 'Thể loại',
    search_recent_item_loc: 'Địa điểm',
    search_recent_item_time_min: '{count} phút trước',
    search_recent_item_time_hour: '{count} giờ trước',
    search_recent_item_time_yesterday: 'Hôm qua',

    promo_placeholder_title: 'Ưu đãi bữa tối đặc biệt',
    promo_placeholder_desc: 'Nhập chi tiết chiến dịch...',
    menu_placeholder_name: 'Phở bò',
    menu_placeholder_ingredients: 'Bánh phở, thịt bò, rau thơm, gia vị...',
    auth_name_placeholder: 'VD: Nguyễn Văn A',
    auth_owner_name_placeholder: 'VD: Nguyễn Văn B',
    auth_res_placeholder: 'VD: Phở Hà Nội',
    auth_phone_placeholder: '0123 456 789',

    nav_terms: 'Điều khoản sử dụng',
    nav_privacy: 'Chính sách bảo mật',
    terms_title: 'Điều khoản sử dụng',
    terms_subtitle: 'Cảm ơn bạn đã sử dụng VietDine. Các điều khoản này quy định các điều kiện sử dụng dịch vụ của chúng tôi.',
    terms_agree_btn: 'Đồng ý và quay lại đăng ký',
    terms_download_btn: 'Tải xuống PDF',
    terms_updated_at: 'Cập nhật lần cuối: {date}',

    rest_placeholder_subtitle: 'Trải nghiệm ẩm thực Kaiseki thuần túy',
    rest_placeholder_desc: 'Kyoto Garden mang đến tinh hoa của ẩm thực Kaiseki đích thực ngay tại trung tâm Hà Nội. Trong không gian mang đậm tinh thần Thiền, hãy thưởng thức những món ăn nghệ thuật tận dụng nguyên liệu theo mùa.',
    rest_review_author_loc: 'Sống tại Hà Nội',
    rest_review_placeholder: 'Ẩm thực Kaiseki gần với bản gốc nhất tại Hà Nội. Nguyên liệu được xử lý cực kỳ tỉ mỉ, tạo cảm giác như đang ở Nhật Bản.',
    rest_info_allergy: 'Có dán nhãn dị ứng (trứng, sữa, lúa mì).',
    rest_info_vege: 'Có sẵn tùy chọn chay (cần đặt trước 24 giờ).',
    rest_info_halal: 'Có sẵn tùy chọn Halal.',

    owner_dashboard_title: 'Bảng quản lý chủ quán',
    common_today: 'Hôm nay',
    common_tomorrow: 'Ngày mai',
    owner_res_guests_label: '{count} khách',

    owner_chat_title: 'Quản lý đặt bàn & chat',
    owner_chat_search_placeholder: 'Tìm kiếm theo mã đặt bàn hoặc tên khách hàng',
    owner_chat_list_title: 'Danh sách đặt bàn',
    owner_chat_list_empty: 'Không có đặt bàn nào',
    owner_chat_select_prompt: 'Chọn một cuộc trò chuyện',
    owner_chat_select_sub: 'Vui lòng chọn một đặt bàn từ danh sách bên trái để bắt đầu chat',
    owner_chat_online: 'Trực tuyến',
    owner_chat_typing: 'Đang nhập...',
    owner_chat_input_placeholder: 'Nhập tin nhắn...',
    owner_chat_send: 'Gửi',
    owner_chat_no_messages: 'Chưa có tin nhắn nào',
    owner_chat_items_count: '{count} mục',
    owner_chat_user_suffix: '',
    bookings_not_found: 'Không tìm thấy đặt bàn',
    bookings_back_to_list: 'Quay lại danh sách đặt bàn',
    bookings_wait_confirmation: 'Chờ xác nhận',
    bookings_chat_empty_sub: 'Hãy gửi câu hỏi hoặc yêu cầu cho nhà hàng.',
  },

  en: {
    nav_home: 'Home',
    nav_saved: 'Saved',
    nav_bookings: 'Bookings',
    nav_profile: 'Profile',
    nav_search: 'Search',
    nav_favorites: 'Favorites',
    nav_reservations: 'Reservations',
    nav_settings: 'Settings',

    home_title: 'Vietnamese Cuisine,\nCloser Than Ever.',
    home_subtitle: 'VietDine helps you discover safe, authentic Vietnamese restaurants verified by the Japanese community in Hanoi.',
    home_map_btn: 'Search on Map',
    home_login_btn: 'Login to Save',
    home_featured: 'Popular Restaurants Verified by Community',
    home_jp_ok: 'Japanese OK',
    home_clean: 'High Cleanliness',
    home_search_title: 'Search Restaurants',
    home_search_placeholder: 'What are you looking for?',
    home_search_btn: 'Search',
    home_tab_list: 'List',
    home_tab_map: 'Map',
    home_filter_price: 'Price',
    home_filter_rating: 'Rating',
    home_filter_category: 'Category',
    home_recommended: 'Recommended',
    home_cuisine_desc: 'Authentic Japanese cuisine & sushi',

    landing_hero_title: 'Discover Authentic\nVietnamese Cuisine.',
    landing_hero_subtitle: 'Find safe, high-quality Vietnamese restaurants handpicked and verified by the Japanese community in Hanoi.',
    landing_cta_explore: 'Explore Restaurants',
    landing_cta_login: 'Login / Register',
    landing_feat1_title: 'Curated Selection',
    landing_feat1_desc: 'We only feature clean, delicious restaurants that meet the high standards of Japanese expats.',
    landing_feat2_title: 'Japanese Support',
    landing_feat2_desc: 'Easily find restaurants with Japanese menus or Japanese-speaking staff.',
    landing_feat3_title: 'Easy Reservations',
    landing_feat3_desc: 'Book a table effortlessly through the app and chat directly with restaurants for special requests.',
    landing_section_features: 'Why Choose VietDine',
    landing_section_popular: 'Popular Restaurants',
    landing_view_all: 'View All',
    landing_ready_title: 'Ready for a culinary journey?',
    landing_ready_subtitle: 'Join VietDine and uncover the hidden gems of Hanoi.',

    auth_welcome_back: 'Welcome back.',
    auth_login: 'Login',
    auth_register: 'Register',
    auth_email: 'Email or Phone Number',
    auth_password: 'Password',
    auth_name: 'Full Name',
    auth_phone: 'Phone Number',
    auth_confirm_password: 'Confirm Password',
    auth_forgot_password: 'Forgot password?',
    auth_no_account: "Don't have an account?",
    auth_has_account: 'Already have an account?',
    auth_register_now: 'Register now',
    auth_owner_portal: 'Owner Portal',
    auth_owner_login: 'Welcome to store management.',
    auth_owner_register: 'Create Store Account',
    auth_restaurant_name: 'Restaurant Name',

    profile_title: 'Profile',
    profile_personal_info: 'Personal Info',
    profile_saved_list: 'Saved List',
    profile_change_password: 'Change Password',
    profile_search_history: 'Search History',
    profile_logout: 'Logout',
    profile_reviews: 'Reviews',
    profile_bookings: 'Bookings',
    profile_account_settings: 'Account Settings',
    profile_premium: 'Premium Member',

    restaurant_features: 'Features',
    restaurant_menu: 'Menu',
    restaurant_reviews: 'Reviews',
    restaurant_owner: 'Owner Info',
    restaurant_reservation: 'Reservation',
    restaurant_reserve_btn: 'Reserve a Table',
    restaurant_clean: 'High Cleanliness',
    restaurant_jp_menu: 'Japanese Menu',
    restaurant_air_con: 'Air Conditioning',
    restaurant_jp_staff: 'Japanese Speaking Staff',
    restaurant_no_menu: 'No menu information available',
    restaurant_no_reviews: 'No reviews yet',
    restaurant_accepting: 'This restaurant is accepting reservations.',
    restaurant_details: 'View Details',

    map_search_placeholder: 'Search restaurants in Hanoi...',
    map_map_tab: 'Map',
    map_restaurants_tab: 'Restaurants',
    map_featured_tab: 'Featured',
    map_available: 'Available',
    map_full: 'Full Today',
    map_waitlist: 'Waitlist',
    map_hello: 'Hello',
    map_hungry: 'Feeling hungry?',
    map_reserve_btn: 'Reserve a Table',

    bookings_title: 'Booking Management',
    bookings_subtitle: 'View your reservations and chat with restaurants',
    bookings_empty: 'No bookings yet',
    bookings_empty_sub: 'Find a restaurant and make a reservation',
    bookings_find: 'Find Restaurants',
    bookings_confirmed: 'Confirmed',
    bookings_waiting: 'Pending',
    bookings_cancelled: 'Cancelled',
    bookings_cancel_btn: 'Cancel',
    bookings_cancel_confirm: 'Cancel this reservation?',
    bookings_guests: 'guests',
    bookings_loading: 'Loading...',

    saved_title: 'Saved List',
    saved_empty: 'No saved restaurants',
    saved_empty_sub: 'Find your favorite restaurants and tap the save icon to add them here.',
    saved_find: 'Find Restaurants',

    history_title: 'Search History',
    history_clear_all: 'Clear All',
    history_empty: 'No search history',
    history_empty_sub: 'When you search for restaurants, your history will appear here.',

    change_pw_title: 'Change Password',
    change_pw_current: 'Current Password',
    change_pw_new: 'New Password',
    change_pw_confirm: 'Confirm New Password',
    change_pw_requirements: 'Password Requirements:',
    change_pw_btn: 'Change Password',
    change_pw_back: '← Back to Profile',
    change_pw_subtitle: 'Protect your account security',

    owner_dashboard: 'Dashboard',
    owner_menu: 'Menu Management',
    owner_promotions: 'Promotions',
    owner_reservations: 'Reservations',
    owner_chat: 'Chat',
    owner_panel: 'Owner Management Panel',

    auth_login_subtitle: 'A refined dining experience',
    auth_register_start: 'Get started',
    auth_register_create: 'Create Account',
    auth_register_welcome: 'Welcome to the VietDine community.',
    auth_register_terms: 'I agree to the Terms of Service and Privacy Policy.',
    auth_register_terms_sub: 'Agree to the terms for users in Vietnam.',
    auth_register_btn: 'Register',
    auth_owner_email: 'Owner Email',
    auth_owner_register_label: 'Owner Registration',
    auth_owner_register_subtitle: 'Start your business on VietDine.',
    auth_owner_register_btn: 'Register as Owner',
    auth_owner_name: 'Owner Name',
    auth_owner_manage: 'Manage your restaurant optimally',
    auth_owner_no_account: "Don't have an owner account?",
    auth_owner_has_account: 'Already have an owner account?',
    auth_owner_left_title: 'Grow your\nbusiness.',
    auth_owner_left_sub: 'Reach the Japanese community directly and maximize your restaurant\'s appeal.',
    auth_register_left_title: 'A refined\nculinary journey.',
    auth_register_left_sub: 'Welcome to an exclusive community for Japanese expats and food lovers exploring Vietnamese cuisine.',
    auth_user_login: 'User Login',
    auth_google_soon: 'Google sign-up coming soon',
    auth_fb_soon: 'Facebook sign-up coming soon',
    auth_email_label: 'Email',

    personal_info_email_note: 'Email cannot be changed',
    personal_info_subtitle: 'PERSONAL INFORMATION',

    saved_page_title: 'Saved Restaurants',
    saved_page_subtitle: 'Your saved cafes & restaurants',
    saved_filter_rating: 'Rating',
    saved_filter_distance: 'Distance',
    saved_filter_seats: 'Availability',
    saved_filter_btn: 'Filter',
    saved_available: 'Available',
    saved_full: 'Full',

    profile_personal_info_sub: 'View and edit your personal info',
    profile_saved_list_sub: 'Manage your saved restaurants',
    profile_change_password_sub: 'Update your account password',
    profile_search_history_sub: 'Review your recent searches',
    profile_logout_sub: 'Sign out of your account',
    profile_reviews_label: 'REVIEWS',
    profile_bookings_label: 'BOOKINGS',
    profile_settings_label: 'ACCOUNT SETTINGS',
    profile_premium_label: 'Premium Member',

    booking_reserve_now: 'Reserve Now',
    history_clear_confirm: 'Delete all search history?',

    common_loading: 'Loading...',
    common_save: 'Save',
    common_cancel: 'Cancel',
    common_delete: 'Delete',
    common_edit: 'Edit',
    common_back: 'Back',
    common_submit: 'Submit',
    common_search: 'Search',

    profile_role_admin: 'Restaurant Admin',
    sidebar_view_public: 'View Public Page',

    owner_stat_total_res: 'Total Reservations',
    owner_stat_weekly_sales: 'Weekly Sales',
    owner_promo_active_label: 'Active Promotion',
    owner_promo_update: 'Update',
    owner_recent_res_title: 'Recent Reservations',
    owner_recent_res_view_all: 'View All',
    owner_recent_res_empty: 'No reservations yet',
    owner_recent_res_empty_sub: 'New reservations will appear here',
    owner_info_title: 'Store Information',
    owner_info_address: 'Address',
    owner_info_hours: 'Opening Hours',
    owner_info_categories: 'Categories',
    owner_info_max_seats: 'Max Seats',
    owner_info_seats_unit: 'seats',
    owner_info_not_set: 'Not set',
    owner_info_edit_btn: 'Edit Profile',

    owner_menu_add_btn: 'Add New Menu Item',
    owner_menu_list_title: 'Menu List ({count} items)',
    owner_menu_empty: 'No menu items yet',
    owner_menu_empty_sub: 'Click Add New Menu Item to get started',
    owner_menu_col_name: 'Dish Name',
    owner_menu_col_ingredients: 'Ingredients',
    owner_menu_col_price: 'Price',
    owner_menu_col_actions: 'Actions',
    owner_menu_delete_title: 'Delete this item?',
    owner_menu_delete_warning: 'This action cannot be undone.',

    menu_form_edit_title: 'Edit Menu Item',
    menu_form_add_title: 'Add New Menu Item',
    menu_form_name_vn: 'Dish Name (Vietnamese)',
    menu_form_name_jp: 'Dish Name (Japanese)',
    menu_form_ingredients: 'Ingredients',
    menu_form_price: 'Price (VND)',
    menu_form_image_url: 'Image URL',
    menu_form_btn_add: 'Add Item',
    menu_form_btn_update: 'Update Item',
    menu_form_btn_saving: 'Saving...',

    owner_promo_list_title: 'All {count} promotions',
    owner_promo_add_btn: 'New Promotion',
    owner_promo_empty: 'No promotions yet',
    owner_promo_empty_sub: 'Create a campaign to attract customers',
    owner_promo_status_active: 'Active',
    owner_promo_status_ended: 'Ended',
    owner_promo_delete_title: 'Delete promotion?',

    promo_form_edit_title: 'Edit Promotion',
    promo_form_add_title: 'Create New Promotion',
    promo_form_title_label: 'Title',
    promo_form_desc_label: 'Description',
    promo_form_discount_label: 'Discount (%)',
    promo_form_status_label: 'Status',
    promo_form_status_active: 'Active',
    promo_form_status_inactive: 'Inactive',
    promo_form_start_date: 'Start Date',
    promo_form_end_date: 'End Date',
    promo_form_btn_add: 'Create',

    owner_res_tab_all: 'All',
    owner_res_empty: 'No reservations',
    owner_res_empty_sub: 'No reservations found',
    owner_res_col_customer: 'Customer',
    owner_res_col_datetime: 'Date & Time',
    owner_res_col_guests: 'Guests',
    owner_res_col_status: 'Status',
    owner_res_action_confirm: 'Confirm',
    owner_res_action_reject: 'Reject',

    search_popular_searches: 'Popular Searches',
    search_popular_categories: 'Popular Categories',
    search_recent_searches: 'Recent Searches',
    search_delete_history: 'Delete',
    search_view_all_history: 'View all history',

    booking_modal_login_req: 'Login required to book',
    booking_modal_date_req: 'Please select date and time',
    booking_modal_future_req: 'Please select a future date and time',
    booking_modal_fail: 'Booking failed',
    booking_modal_network_err: 'Network error',
    booking_modal_success_title: 'Booking request received',
    booking_modal_success_desc1: 'Booking request has been sent to the restaurant.',
    booking_modal_success_desc2: 'Please wait for confirmation from the restaurant.',
    booking_modal_view_list: 'View bookings list',
    booking_modal_close: 'Close',
    booking_modal_title: 'Make a Reservation',
    booking_modal_date: 'Date',
    booking_modal_time: 'Time',
    booking_modal_guests: 'Guests',
    booking_modal_max_seats: 'Up to {max} seats',
    booking_modal_submit: 'Confirm Booking',
    booking_modal_submitting: 'Submitting...',

    map_loading: 'Loading map...',

    rest_community_rec: 'Community Recommended',
    rest_contact: 'Contact',
    rest_details_title: 'Store Details',
    rest_seasonal_menu: 'Seasonal Menu',
    rest_trust_reviews: 'Trust & Reviews',
    rest_reviews_count: '{count} reviews',
    rest_hours: 'Opening Hours',
    rest_budget: 'Budget',
    rest_status_open: 'Open',
    rest_status_closed: 'Closed',
    rest_dining_info: 'Dining Information',

    auth_processing: 'Processing...',
    auth_or_continue: 'or continue with',
    auth_google_err: 'An error occurred during Google login.',
    auth_google_fail: 'Google login failed.',
    auth_provider_soon: '{provider} login is coming soon',

    validation_email_req: 'Please enter your email',
    validation_email_invalid: 'Please enter a valid email',
    validation_password_req: 'Please enter your password',
    validation_password_min: 'Password must be at least 8 characters',
    validation_name_min: 'Name must be at least 2 characters',
    validation_phone_req: 'Please enter your phone number',
    validation_confirm_req: 'Please enter password confirmation',
    validation_match: 'Passwords do not match',
    validation_res_name_req: 'Please enter restaurant name',
    validation_alpha: 'Please include letters',
    validation_number: 'Please include numbers',

    search_recent_item_cat: 'Category',
    search_recent_item_loc: 'Location',
    search_recent_item_time_min: '{count}m ago',
    search_recent_item_time_hour: '{count}h ago',
    search_recent_item_time_yesterday: 'Yesterday',

    promo_placeholder_title: 'Sunset Dinner Special Plan',
    promo_placeholder_desc: 'Enter campaign details...',
    menu_placeholder_name: 'Beef Pho',
    menu_placeholder_ingredients: 'Rice noodles, beef, herbs, spices...',
    auth_name_placeholder: 'e.g. John Doe',
    auth_owner_name_placeholder: 'e.g. Jane Smith',
    auth_res_placeholder: 'e.g. Pho Hanoi',
    auth_phone_placeholder: '0123 456 789',

    nav_terms: 'Terms of Service',
    nav_privacy: 'Privacy Policy',
    terms_title: 'Terms of Service',
    terms_subtitle: 'Thank you for using VietDine. These terms govern the conditions for using our service.',
    terms_agree_btn: 'Agree and return to Register',
    terms_download_btn: 'Download PDF',
    terms_updated_at: 'Last updated: {date}',

    rest_placeholder_subtitle: 'Authentic Kaiseki Dining Experience',
    rest_placeholder_desc: 'Kyoto Garden brings the essence of authentic Kaiseki cuisine to the heart of Hanoi. Enjoy artistic dishes that make the most of seasonal ingredients in a space based on the spirit of Zen.',
    rest_review_author_loc: 'Lives in Hanoi',
    rest_review_placeholder: 'The closest thing to authentic Kaiseki in Hanoi. The handling of ingredients is extremely careful, giving the illusion of being in Japan.',
    rest_info_allergy: 'Allergy labeling available (egg, milk, wheat).',
    rest_info_vege: 'Vegetarian options available (24h advanced notice required).',
    rest_info_halal: 'Halal options available.',

    owner_dashboard_title: 'Owner Management Panel',
    common_today: 'Today',
    common_tomorrow: 'Tomorrow',
    owner_res_guests_label: '{count} guests',

    owner_chat_title: 'Booking & Chat Management',
    owner_chat_search_placeholder: 'Search by booking ID or customer name',
    owner_chat_list_title: 'Reservations',
    owner_chat_list_empty: 'No reservations found',
    owner_chat_select_prompt: 'Select a chat',
    owner_chat_select_sub: 'Please select a reservation from the list on the left to start chatting',
    owner_chat_online: 'Online',
    owner_chat_typing: 'Typing...',
    owner_chat_input_placeholder: 'Type a message...',
    owner_chat_send: 'Send',
    owner_chat_no_messages: 'No messages yet',
    owner_chat_items_count: '{count} items',
    owner_chat_user_suffix: '',
    bookings_not_found: 'Booking not found',
    bookings_back_to_list: 'Back to bookings list',
    bookings_wait_confirmation: 'Waiting for confirmation',
    bookings_chat_empty_sub: 'Send your questions or requests to the restaurant.',
  },
};

export function getTranslations(locale: Locale): TranslationKeys {
  return translations[locale];
}

export function t(locale: Locale, key: keyof TranslationKeys): string {
  return translations[locale][key] || translations['ja'][key] || key;
}
