There are two group objects that are necessary here. The first is a group object representing the group, the second is a group message object representing messages in a given group. The group object will have:

- group uuid
- group name
- group members (member uuids)
- group messages (message uuid list)
- description
- date created (datetime)
- is flagged (bool)
- is suspended / deleted

The group message object will need to have some other details as well, the columns will include the following.

- message uuid
- message user gid
- group uuid
- date created (datetime)
- message content
- attached bet
- reactions ({user gid, reaction type (like, laugh, etc.)})

These two objects, in tables groups and group_messages will essentially encompass all functionality necessary to run the group messaging features.
