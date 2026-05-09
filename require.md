# Yêu cầu dự án: VietDine (ベトダイン)

## 1. Đối tượng hướng đến
- **Người Nhật đang sinh sống hoặc đi du lịch tại Hà Nội** (người muốn tìm kiếm nhà hàng Việt Nam đáng tin cậy, đạt chuẩn và có chứng nhận).
- **Chủ nhà hàng Việt Nam** (người muốn thu hút thêm khách hàng Nhật Bản và trực tiếp tiếp cận cộng đồng này hiệu quả).

## 3. 課題・解決策 (Vấn đề và Giải pháp)
| ID | 想定ユーザー (Người dùng dự kiến) | 課題：解決に向けて取り組むべきこと・理想の状態 (Vấn đề: Trạng thái lý tưởng/cần giải quyết) | 解決策：課題を実行・実現するための具体的手段 (Giải pháp: Phương tiện cụ thể để thực hiện) |
|---|---|---|---|
| 1 | 一般ユーザー (Người dùng) | ユーザーは自分の細かい基準（衛生、言語対応、接客、空調設定など）を満たすレストランを簡単に探したい。<br>(Người dùng muốn dễ dàng tìm kiếm nhà hàng đáp ứng các tiêu chuẩn khắt khe của mình như vệ sinh, ngoại ngữ, phục vụ, điều hòa). | 検索・フィルター機能を強化し、細かい条件（日本語OK、衛生評価など）でレストランを探せるようにする。<br>(Cung cấp chức năng tìm kiếm và lọc chi tiết theo các điều kiện cá nhân hóa như có tiếng Nhật, đánh giá vệ sinh). |
| 2 | 一般ユーザー (Người dùng) | ユーザーはメニューの成分や具材、写真を事前に確認して安心して注文したい。<br>(Người Nhật rất quan tâm đến việc món ăn có thành phần gì, nên họ muốn xem trước ảnh món ăn và chi tiết các nguyên liệu). | 多言語メニュー、写真、および詳細な成分・具材リストの表示機能を提供する。<br>(Cung cấp chức năng hiển thị thực đơn đa ngôn ngữ, kèm hình ảnh minh họa và danh sách chi tiết các nguyên liệu). |
| 3 | 一般ユーザー (Người dùng) | ユーザーはハノイの日本人コミュニティによって認証・評価された信頼できるレストランを知りたい。<br>(Người dùng đánh giá cao việc tham khảo từ người khác, do đó muốn biết những nhà hàng uy tín đã được cộng đồng người Nhật chứng nhận). | 「日本の認証」を受けた店舗のリストと、日本人ユーザーのレビューに基づいた評価システムを生成するアルゴリズムを開発する。<br>(Xây dựng thuật toán giúp tạo danh sách cửa hàng với "Chứng nhận của người Nhật" và hệ thống đánh giá từ review của người Nhật). |
| 4 | 店舗オーナー (Chủ quán) | オーナーはコストを抑えつつ、日本人コミュニティ（SNSやグループなど）に直接店舗をアピールしたい。<br>(Chủ nhà hàng muốn quảng bá trực tiếp, hiệu quả đến cộng đồng người Nhật mà không tốn quá nhiều chi phí như chạy quảng cáo). | 日本人コミュニティに特化した店舗情報掲載や、プロモーション発信機能を提供する。<br>(Cung cấp chức năng đăng tải thông tin quán và tuyên truyền khuyến mãi để tiếp cận trực tiếp các hội nhóm cộng đồng người Nhật). |
| 5 | 店舗オーナー (Chủ quán) | オーナーや旅行会社は、日本人客の細かい要望やスケジュール変更などの連絡・やり取りをスムーズに行いたい。<br>(Chủ quán và đại lý du lịch muốn giảm bớt khó khăn trong khâu trao đổi các yêu cầu chi tiết và thay đổi lịch trình của khách Nhật). | 要件の詳細なやり取りやスケジュール調整を効率化する、チャット・予約・問い合わせ管理システムを提供する。<br>(Cung cấp tiện ích nhắn tin, quản lý đặt bàn/phòng để dễ dàng xử lý các yêu cầu tỉ mỉ và điều chỉnh biến động lịch trình). |

## 4. アプリ名称 (Tên ứng dụng)
**VietDine (ベトダイン)**

## 5. ロール一覧 (Danh sách Role)
| ID | ロール名 (Tên Role) | 役割 (Vai trò) |
|---|---|---|
| 1 | 一般ユーザー (Người dùng) | レストランの検索、メニュー・成分の確認、レビュー機能の利用、保存。<br>(Tìm kiếm nhà hàng, xem thực đơn/nguyên liệu, đọc/viết đánh giá và lưu quán). |
| 2 | 店舗オーナー (Chủ quán) | 店舗情報や多言語メニューの管理、写真の提供、日本人向けの集客管理、細かな要件や予約の対応。<br>(Quản lý thông tin quán, thực đơn đa ngôn ngữ, đăng ảnh, quản lý khuyến mãi, phản hồi yêu cầu chi tiết và đặt bàn). |
| 3 | ゲスト(Khách) | 未ログインの人。レストランの検索や情報閲覧のみ可能。<br>(Người chưa đăng nhập. Chỉ có thể tìm kiếm và xem thông tin nhà hàng). |

## 6. 機能一覧 (Danh sách tính năng)
| ID | 機能名 (Tên tính năng) | 解決策ID (ID Giải pháp) | 対象ロールID (ID Role) | 機能の概要 (Tóm tắt tính năng) |
|---|---|---|---|---|
| 1 | レストラン検索・フィルター機能 (Tìm kiếm & Lọc) | 1 | 1, 3 | 希望の条件（衛生面、言語、空調など）でレストランを検索し、一覧表示する機能。<br>(Chức năng tìm kiếm và hiển thị danh sách nhà hàng theo điều kiện khắt khe như vệ sinh, ngôn ngữ, điểu hòa). |
| 2 | 多言語メニュー・成分表示 (Thực đơn đa ngôn ngữ & Thành phần) | 2 | 1, 2, 3 | 料理の成分詳細と写真を日本語等の多言語で表示・更新する機能。<br>(Hiển thị và cập nhật chi tiết nguyên liệu, hình ảnh món ăn bằng nhiều ngôn ngữ). |
| 3 | コミュニティ認証・レビュー (Chứng nhận cộng đồng & Đánh giá) | 3 | 1, 3 | レビューを読み書きし、日本人コミュニティの認証済リストを確認する機能。<br>(Đọc, viết đánh giá và xem danh sách các quán đã được chứng nhận bởi cộng đồng người Nhật). |
| 4 | 店舗・プロモーション管理 (Quản lý thông tin quán & Khuyến mãi) | 4 | 2 | オーナーが店舗情報を発信し、集客のためのプロモーション機能を設定する機能。<br>(Chủ quán đăng tải thông tin và triển khai các chương trình quảng bá thu hút khách). |
| 5 | 予約・要件・問い合わせ管理 (Quản lý Đặt bàn & Yêu cầu) | 5 | 1, 2 | 細かい要求や予約スケジュールの変更などを円滑に連絡・調整する機能。<br>(Hỗ trợ trao đổi, xử lý các yêu cầu chi tiết của khách và thay đổi lịch trình đặt bàn). |
| 6 | 保存（ブックマーク）機能 (Lưu / Bookmark quán) | - | 1 | 気に入ったレストランをお気に入りリストに保存する機能。<br>(Cho phép người dùng lưu các nhà hàng vào danh sách yêu thích.) |
| 7 | ログイン・登録 (Đăng nhập & Đăng ký) | - | 1, 2, 3 | ユーザーかオーナーのアカウントを登録・ログインする機能。<br>(Chức năng đăng ký và đăng nhập tài khoản cho người dùng/chủ quán). |
| 8 | プロフィール・店舗管理 (Quản lý hồ sơ/quán) | - | 1, 2 | 自身のアカウント情報の更新や、店舗情報を一元管理する。<br>(Cập nhật thông tin cá nhân hoặc quản lý tập trung thông tin quán/ứng dụng). |
| 9 | 検索履歴機能 (Tính năng lịch sử tìm kiếm) | 1 | 1 | 過去に検索した条件やレストランの履歴を保存・表示する機能。<br>(Tính năng lưu và hiển thị lịch sử các điều kiện tìm kiếm hoặc nhà hàng đã tìm trước đó). |
| 10 | パスワード変更・管理機能 (Tính năng đổi/quản lý mật khẩu) | - | 1, 2 | ユーザーやオーナーがアカウントのパスワードを安全に変更・更新する機能。<br>(Tính năng cho phép người dùng hoặc chủ quán thay đổi và cập nhật mật khẩu an toàn). |

## 7. 画面一覧 (Danh sách màn hình)
| ID | 画面名 (Tên màn hình) | 機能ID (ID Tính năng) | 対象ロールID (ID Role) | 画面の概要 (Tóm tắt màn hình) |
|---|---|---|---|---|
| 1 | ホーム 画面 (Màn hình Trang chủ) | 1, 9 | 1, 3 | 地図や一覧を表示し、レストランの検索と認証済リストを確認するメイン画面。<br>(Màn hình chính tìm kiếm nhà hàng và danh sách quán được chứng nhận). |
| 2 | レストラン詳細画面 (Màn hình Chi tiết nhà hàng) | 2, 3, 5, 6 | 1, 3 | 詳細情報、写真、多言語メニュー、具材成分、コミュニティのレビューを表示する。<br>(Hiển thị thông tin chi tiết, hình ảnh, thực đơn đa ngôn ngữ, thành phần, đánh giá). |
| 3 | マイリスト（保存）画面 (Màn hình Quán đã lưu) | 6 | 1 | ユーザーが保存したレストランの一覧を表示する。<br>(Hiển thị danh sách các quán ăn mà người dùng đã bookmark). |
| 4 | オーナー管理画面 (Màn hình Quản lý của Chủ quán) | 4, 8 | 2 | オーナーがメニューや成分を更新し、集客プロモーションを作成する画面。<br>(Nơi chủ quán cập nhật thực đơn, thành phần và tạo chương trình quảng bá). |
| 5 | 予約・チャット管理画面 (Màn hình Quản lý Đặt bàn & Chat) | 5 | 1, 2 | 客や旅行会社との細かい要望のやり取り、予約スケジュールの調整を行う画面。<br>(Nơi trao đổi yêu cầu chi tiết và điều chỉnh lịch trình đặt bàn/chat). |
| 6 | 客のログイン・登録画面 (Màn hình Đăng nhập/Đăng ký cho khách) | 7 | 3 | システムにアクセスするための情報を入力する。<br>(Nơi người dùng nhập thông tin để đăng ký hoặc truy cập vào hệ thống). |
| 7 | プロフィール画面 (Màn hình Hồ sơ cá nhân) | 8 | 1 | ユーザーが自身の基本情報を確認・編集する画面。<br>(Nơi người dùng kiểm tra và chỉnh sửa thông tin cá nhân). |
| 8 | オーナーのログイン・登録画面 (Màn hình đăng nhập/đăng ký cho chủ quán) | 7 | 3 | オーナーがシステムにアクセスするためのログイン・登録情報を入力する画面。<br>(Nơi chủ quán nhập thông tin để đăng ký hoặc đăng nhập vào hệ thống quản lý quán). |
| 9 | 顧客の検索履歴画面 (Màn hình lịch sử tìm kiếm của khách) | 9 | 1 | ユーザーが過去に検索したキーワードや履歴を表示する画面。<br>(Hiển thị danh sách các từ khóa và nhà hàng mà người dùng đã tìm kiếm trước đó). |
| 10 | パスワード変更画面 (Màn hình thay đổi mật khẩu) | 10 | 1, 2 | ユーザーまたはオーナーが変更する画面。<br>(Màn hình cho phép người dùng hoặc chủ quán thay đổi mật khẩu). |
| 11 | マップ 画面 (Màn hình Bản đồ) | 11 | 1, 3 | 地図や一覧を表示し、レストランの検索と認証済リストを確認するメイン画面。<br>(Màn hình chính Hiển thị bản đồ). |
