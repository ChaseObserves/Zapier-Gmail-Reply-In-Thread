// We recommend writing your creates separate like this and rolling them
// into the App definition at the end.
module.exports = {
    key: 'reply',
  
    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'Reply',
    display: {
      label: 'Reply In-Thread',
      description: 'Sends a reply to an email in-thread.'
    },
  
    // `operation` is where the business logic goes.
    operation: {
      inputFields: [
        {key: 'replyTo', required: true, type: 'string'},
        {key: 'emailSubject', required: true, type: 'string', helpText: 'The subject of the email being responded to'},
        {key: 'threadId', required: true, type: 'string', label: 'Thread ID', helpText: 'The unique Thread ID of the email being responded to'},
        {key: 'bodyText', required: true, type: 'text', label: 'Email Body', helpText: 'The body of the message'}
      ],
      perform: (z, bundle) => {
        const promise = z.request(`https://accounts.google.com/o/oauth2/token`, {
          method: 'POST',
          body: {
            code: bundle.inputData.code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: '{{bundle.inputData.redirect_uri}}',
            grant_type: 'authorization_code'
          },
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        });
      
        // Needs to return at minimum, `access_token`, and if your app also does refresh, then `refresh_token` too
        return promise.then((response) => {
          if (response.status !== 200) {
            throw new Error('Unable to fetch access token: ' + response.content);
          }
      
          const result = JSON.parse(response.content);
          return {
            access_token: result.access_token,
            // refresh_token: result.refresh_token
          };
        });

        function sendReply() {
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
      },
  
      // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
      // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
      // returned records, and have obviously dummy values that we can show to any user.
      sample: {
        id: 1,
        createdAt: 1472069465,
        replyTo: 'person@email.com',
        emailSubject: 'New Purchase Order',
        threadId: '123ffg54tgdfg',
        bodyText: 'Thank you for your order. We have received it and are processing it now.'
      },
  
      // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
      // field definitions. The result will be used to augment the sample.
      // outputFields: () => { return []; }
      // Alternatively, a static field definition should be provided, to specify labels for the fields
      outputFields: [
        {key: 'id', label: 'ID'},
        {key: 'createdAt', label: 'Created At'},
        {key: 'replyTo', label: 'Reply To'},
        {key: 'emailSubject', label: 'Email Subject'},
        {key: 'threadId', label: 'Thread ID'},
        {key: 'bodyText', label: 'Email Body'}
      ]
    }
  };