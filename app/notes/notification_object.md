Doing this since I have no interest nor motivation to actually build out these data tables right now. The notication object needs some core columns

- notification uuid
- User gid
- notification datetime
- notification content
- Notification sender (The user who initiated the action which created the notification)
- notification seen? (bool)
- is group invite (bool)
- group uuid (if group invite notification)
- post uuid (if notification for post)
- user uuid (if follow request)

