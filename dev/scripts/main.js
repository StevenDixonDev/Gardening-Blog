(function(){

    fetch('./posts/posts.json').then(res => res.json())
    .then(data => console.log(data));
    const List = {
        template: '#list-template',
        data: () => ({
            posts: []
        }),
        mounted() {
            this.getPosts();
        },
        methods: {
            getPosts() {
                fetch('./posts/posts.json').then(res => res.json())
                .then(data => this.posts = data._Entries).catch(error => {
                    console.log(error);
                })
            }
        }
    };

    // Post component
    const Post = {
        template: '#post-template',
        data: () => ({
            post: null
        }),
        mounted() {
            this.getPosts();
        },
        methods: {
            getPosts() {
                let id = this.$route.params.id;
                console.log(id)
                fetch('./posts/posts.json').then(res => res.json())
                .then(data => this.post = data._Entries.filter(item => item.Id === id)[0]).catch(error => {
                    console.log(error);
                })
            }
        }
    };

    // Create vue router
    var router = new VueRouter({
        routes: [
            {
                name: 'homepage',
                path: '/',
                component: List
            }, {
                name: 'post',
                path: '/:id',
                component: Post
            }
        ]
    });

    // Create vue instance with our router, and mount onto #app
    var vue = new Vue({router}); 
    var app = vue.$mount('#app'); 

})()