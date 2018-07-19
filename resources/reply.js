// create a reply
const createReply = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://accounts.google.com/o/oauth2/token',
    body: {
      code: '{{bundle.inputData.code}}',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: bundle.inputData.redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
    sendMessage(
      {
        'To': inputFields.replyTo,
        'Subject': inputFields.emailSubject,
        'In-Reply-To': inputFields.threadId
      },
      inputFields.bodyText
    );
    return false;
  }

  function sendMessage (headers_obj, message, callback) {
    var email = '';
    for(var header in headers_obj)
      email += header += ": "+headers_obj[header]+"\r\n";
    email += "\r\n" + message;
    var sendRequest = gapi.client.gmail.users.messages.send({
      'userId': 'me',
      'resource': {
        'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
      }
    });
    return sendRequest.execute(callback);
  }

module.exports = {
  key: 'reply',
  noun: 'Reply',

  create: {
    display: {
      label: 'Create Reply',
      description: 'Creates a new reply.'
    },
    operation: {
      inputFields: [
        {key: 'replyTo', required: true, type: 'string'},
        {key: 'emailSubject', required: true, type: 'string', helpText: 'The subject of the email being responded to'},
        {key: 'threadId', required: true, type: 'string', label: 'Thread ID', helpText: 'The unique Thread ID of the email being responded to'},
        {key: 'bodyText', required: true, type: 'text', label: 'Email Body', helpText: 'The body of the message'}
      ],
      perform: createReply
    },
  },

  sample: {
    id: 1,
    name: 'Test'
  },

  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'createdAt', label: 'Created At'},
    {key: 'replyTo', label: 'Reply To'},
    {key: 'emailSubject', label: 'Email Subject'},
    {key: 'threadId', label: 'Thread ID'},
    {key: 'bodyText', label: 'Email Body'}
  ]
};
