import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { memberJoinStatus } from '~/apis/groupApis';

i18n
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: {
        translation: {
          admin: {
            sidebar: {
              manage: 'Manage',
              report: {
                report_manage: 'Reports Manager'
              }
            }
          },
          standard: {
            home: {
              sidebar: {
                feeds: 'Chats',
                friends: 'Friends',
                groups: 'Groups',
                chatbot: 'Toad mentor',
                your_shortcut: 'Your shortcuts',
              },
              rightSidebar: {
                suggestion: 'Suggestions for you',
                notification: 'Latest notifications',
                contact: 'Contact'
              }
            },
            friend: {
              peopleSuggest: "People you may know",
              request: "Friend requests",
              suggest: "Friend suggestions",
              listFriend: "Friend list",
              yourRequest: "Your friend request",
              noBlock: "You haven't blocked anyone :D",
              noFriend: "You have no friends",
              noRequest: "You have no friend requests",
              noSuggest: "There are no suitable suggestions for you",
              sendMessage: "Send message",
              unFriend: "Unfriend",
              noYourRequest: "You're not asking to be friends with someone :D"
            },
            profile: {
              updateProfile: 'Update Your Profile',
              friend: 'Friend',
              friend2: 'friend',
              cancelRequest: 'Cancel request',
              addFriend: 'Add friend',
              confirmRequest: 'Confirm request',
              deleteRequest: ' Delete request',
              report: 'Report',
              block: 'Block',
              blockUser: 'Block users',
              unblockUserMes: 'Unblock',
              posts: 'Posts',
              about: 'About',
              friends: 'Friends',
              photos: 'Photos',
              videos: 'Videos',
              live: 'Lives in',
              gender: 'Gender',
              relationship: 'Relationship',
              birthday: 'Birthday',
              general: 'General',
              contact: 'Contact',
              webAffiliation: 'Web affiliations',
              webAffiliationMes: 'Websites and social links',
              phone: 'Phone',
              workPlace: 'Work place',
            },
            newPost: {
              createPost: 'Create post',
              post: 'Post',
              editPhoto: 'Edit photo/video',
              editAll: 'Edit all',
              addPhoto: 'Add photos/videos',
              writeSt: 'Write something...',
              editPost: 'Edit post',
              savePost: 'Save',
              userPost: "{{name}} ' Post",
              yourFeed: "Your feed",
              group: "Your group"
            },
            search: {
              searchResult: 'Search results',
              post: 'Post',
              user: 'User',
              group: 'Group',
              all: 'All',
              viewAll: "View all results",
              noData: "Data not found!",
              writeSt: "What do you want to find?"
            },
            media: {
              save: 'Save',
              edit: 'Edit',
              cancel: 'Cancel',
              placeHolder: 'Type something...',
              view: 'View post',
              from: 'This file is from a post',
            },
            comment: {
              new: 'Latest',
              relevant: 'Most relevant',
              edit: 'Edit',
              delete: 'Delete',
              report: 'Report',
              reply: 'Reply',
              author: 'Author',
              noComment: 'This post has no comments yet! Be the first to comment :D',
              noMoreComments: 'There are no more comments to display!'
            },
            react: {
              all: 'All',
              like: 'Like',
              disLike: 'Dislike',
              comment: 'Comment',
              share: 'Share',
              noReact: 'There have been no reactions yet!',
            },
            group: {
              discus: 'Discussion',
              member: 'Members',
              file: 'Medias',
              invite: 'Invite',
              leave: 'Leave',
              join: 'Join',
            }
          },
          sideText: {
            mutualFriend: 'mutual friends',
            noneSuggestion: 'No suggestions are suitable for you',
            noneNotification: 'You have no notifications',
            contactMes: "Let's look for friends",
            yourMind: `What's on your mind`,
            avatarPost: "updated their profile picture.",
            coverPost: "updated their cover picture."
          },
          message: {

          }
        }
      },
      vn: {
        translation: {
          admin: {
            sidebar: {
              manage: 'Quản lý',
              report: {
                report_manage: 'Quản lý báo cáo vi phạm'
              }
            }
          },
          standard: {
            home: {
              sidebar: {
                feeds: 'Chat',
                friends: 'Bạn bè',
                groups: 'Nhóm',
                chatbot: 'Cố vấn Cóc',
                your_shortcut: 'Lối tắt của bạn',
              },
              rightSidebar: {
                suggestion: 'Đề xuất cho bạn',
                notification: 'Thông báo mới nhất',
                contact: 'Người liên hệ'
              }
            },
            friend: {
              peopleSuggest: "Những người bạn có thể biết",
              request: "Yêu cầu kết bạn",
              suggest: "Đề xuất bạn bè",
              listFriend: "Danh sách bạn bè",
              yourRequest: "Yêu cầu bạn gửi",
              noBlock: "Bạn chưa block ai cả :D",
              noFriend: "Bạn chưa có người bạn nào",
              noRequest: "Bạn chưa có yêu cầu kết bạn nào",
              noSuggest: "Không có đề xuất nào phù hợp cho bạn",
              sendMessage: "Nhắn tin",
              unFriend: "Huỷ kết bạn",
              noYourRequest: "Bạn đang không yêu cầu kết bạn với ai :D"
            },
            profile: {
              updateProfile: 'Chỉnh sửa trang cá nhân',
              friend: 'Bạn bè',
              friend2: 'bạn',
              cancelRequest: 'Hủy yêu cầu',
              addFriend: 'Thêm bạn bè',
              confirmRequest: 'Chấp nhận lời mời',
              deleteRequest: 'Xóa yêu cầu',
              report: 'Báo cáo',
              block: 'Chặn',
              blockUser: 'Người dùng bị chặn',
              unblockUserMes: 'Bỏ chặn',
              posts: 'Bài viết',
              about: 'Giới thiệu',
              friends: 'Bạn',
              photos: 'Ảnh',
              videos: 'Video',
              live: 'Nơi ở',
              gender: 'Giới tính',
              relationship: 'Mối quan hệ',
              birthday: 'Sinh nhật',
              general: 'Thông tin cơ bản',
              contact: 'Liên hệ',
              webAffiliation: 'Liên kết ngoài',
              webAffiliationMes: 'Các liên kết web và mạng xã hội',
              phone: 'Phone',
              workPlace: 'Công việc',
            },
            newPost: {
              createPost: 'Tạo bài viết',
              post: 'Đăng bài',
              editPhoto: 'Chỉnh sửa ảnh/video',
              editAll: 'Chỉnh sửa',
              addPhoto: 'Thêm ảnh/video',
              writeSt: 'Bạn đang nghĩ gì...',
              editPost: 'Chỉnh sửa bài viết',
              savePost: 'Lưu',
              userPost: "Bài viết của {{name}}"
            },
            search: {
              searchResult: 'Kết quả tìm kiếm',
              post: 'Bài viết',
              user: 'Mọi người',
              group: 'Hội nhóm',
              all: 'Tất cả',
              viewAll: "Hiển thị tất cả kết quả",
              noData: "Không tìm thông tin phù hợp!",
              writeSt: "Bạn muốn tìm gì?"
            },
            media: {
              save: 'Lưu',
              edit: 'Chỉnh sửa',
              cancel: 'Hủy',
              placeHolder: 'Hãy viết gì đó...',
              view: 'Xem bài viết',
              from: 'File này nằm trong một bài viết.'
            },
            comment: {
              new: 'Mới nhất',
              relevant: 'Liên quan nhất',
              edit: 'Chỉnh sửa',
              delete: 'Xóa',
              report: 'Báo cáo',
              reply: 'Phản hồi',
              author: 'Tác giả',
              noComment: 'Bài viết chưa có bình luận nào! Hãy là người bình luận đầu tiên:D',
              noMoreComments: 'Không còn comemnt để hiển thị!'
            },
            react: {
              all: 'Tất cả',
              like: 'Thích',
              disLike: 'Ghét',
              comment: 'Bình luận',
              share: 'Chia sẻ',
              noReact: 'Chưa có lượt tương tác nào!'
            },
            group: {
              discus: 'Thảo luận',
              member: 'Thành viên',
              file: 'File phương tiện',
              invite: 'Mời',
              leave: 'Rời nhóm',
              join: 'Tham gia'
            }
          },
          sideText: {
            mutualFriend: 'bạn chung',
            noneSuggestion: 'Không có đề xuất nào phù hợp cho bạn',
            noneNotification: 'Bạn không có thông báo mới',
            contactMes: "Hãy tìm kiếm người bạn mới nào!",
            yourMind: `Bạn đang nghĩ gì thế`,
            avatarPost: "đã cập nhật ảnh đại diện của mình.",
            coverPost: "đã cập nhật ảnh bìa của mình."
          },
          message: {

          }
        }
      },
    }
  });

export default i18n
