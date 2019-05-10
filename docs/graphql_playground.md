GraphiQL and GraphQL Playground
=== 

The project uses GraphQL and comes with GraphQL playground. visit [http://localhost/api](http://localhost/api) and you should see an interface in which you can write your queries directly to the server. In order to issue requests, you need to be authenticated by sending a valid token in the headers:

Go to [http://localhost](http://localhost), login and open the inspector. In the console print your localStorage by running `localStorage` in the console and copy your `jwt_token`.

![get_token](https://user-images.githubusercontent.com/31185922/57508792-d314df00-7302-11e9-8ab0-4a1f5d85a455.gif)

Once done, visit [http://localhost/api](http://localhost/api) and in the http headers, add the following lines and replace `<TOKEN>` with your token:

```JSON
{
	"Authentication": "Bearer <TOKEN>"
}
```

Then, update the url of the playground by setting `http://localhost/api/`

![caspr_playground](https://user-images.githubusercontent.com/31185922/57509162-d2c91380-7303-11e9-9117-d36109f603d0.gif)


You are all set to use GraphQL Playground !

You can also install the [chrome extension](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm) to have GraphiQL in your browser