//#1
function createElemWithText(tag = 'p', textContent = '', className = '') {
    //element creation
    const element = document.createElement(tag);
    element.textContent = textContent;
    if (className) {
      element.className = className;}
    return element;}

//#2
function createSelectOptions(users) {
    //for if there is no parameters
    if (!users) {
      return undefined;}
    //empty
    const optionsArray = [];
    //loop through each user
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = user.name;
      optionsArray.push(option);});
    return optionsArray;}

  //#3
  function toggleCommentSection(postId) {
    //look for post
    if (!postId) {
      return undefined;}
    //find right section
    const section = document.querySelector(`section[data-post-id='${postId}']`);
    if (section) {
      section.classList.toggle('hide');}
    return section;}
  
//#4
function toggleCommentButton(postId) {
    //look for post
    if (!postId) {
      return undefined;}
    //find right button
    const button = document.querySelector(`button[data-post-id='${postId}']`);
    if (button) {
      button.textContent = (button.textContent === 'Show Comments') 
        ? 'Hide Comments' 
        : 'Show Comments';}
    return button;}

//#5 (last non-dependent)
function deleteChildElements(parentElement) {
    //valid html
    if (!(parentElement instanceof HTMLElement)) {
        return undefined;}    
    //define child
    let child = parentElement.lastElementChild;
    while (child) {
      parentElement.removeChild(child);
      child = parentElement.lastElementChild;}
    return parentElement;}
  
//#6
function addButtonListeners() {
    //select buttons
    const buttons = document.querySelectorAll('main button');
    //check existance
    if (buttons.length > 0) {
      buttons.forEach(button => {
        button.addEventListener('click', (event) => {
          const postId = button.dataset.postId;
          if (postId) {
            toggleComments(event, postId);}});});
      return buttons;}
    return [];}

//#7
function removeButtonListeners() {
    //select buttons
    const buttons = document.querySelectorAll('main button');
    //make sure it exists
    if (buttons.length > 0) {
      //loop throguh each
      buttons.forEach(button => {
        const postId = button.dataset.id;
        if (postId) {
          const handleClick = (event) => {
            toggleComments(event, postId);};
          button.removeEventListener('click', handleClick);}});
      return buttons;}
    return [];}

//#8
function createComments(commentsData) {
    //check for comments array
    if (!commentsData || !Array.isArray(commentsData)) {
      return undefined;}
    //hold comments
    const fragment = document.createDocumentFragment();
    commentsData.forEach(comment => {
    const article = document.createElement('article');
    //h3 element
    const h3 = createElemWithText('h3', comment.name);
    //p element
    const pBody = createElemWithText('p', comment.body);
    const pEmail = createElemWithText('p', `From: ${comment.email}`);
        //append
        article.appendChild(h3);
        article.appendChild(pBody);
        article.appendChild(pEmail);
        fragment.appendChild(article);});
        return fragment;}

//#9
function populateSelectMenu(users) {
    //check users
    if (!users || !Array.isArray(users)) {
      return undefined;}
    const selectMenu = document.getElementById('selectMenu');
    //pass json data
    const options = createSelectOptions(users);
    if (Array.isArray(options)) {
      options.forEach(option => {
        selectMenu.appendChild(option);});}
    return selectMenu;}

//#10
async function getUsers() {
    try {
      //get data using api
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      //check for erre
      if (!response.ok) {
        throw new Error(`Error fetching users data: ${response.statusText}`);}
      const usersData = await response.json();
        //return json data
        return usersData;} 
            catch (error) {
            console.error("An error occurred while fetching users:", error);
                return null; }}

//#11
async function getUserPosts(userId) {
    //see if user is valid
    if (!userId || typeof userId !== 'number') {
      return undefined;}
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`Error fetching posts for user ${userId}: ${response.statusText}`);}
      const postsData = await response.json();
        //return json data
        return postsData;} 
            catch (error) {
            console.error("An error occurred while fetching user posts:", error);
                return null;}}

//#12
async function getUser(userId) {
    //again check if user id is valid
    if (!userId || typeof userId !== 'number') {
      return undefined; }
    try {
      //get user id
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      if (!response.ok) {
        throw new Error(`Error fetching user data for user ${userId}: ${response.statusText}`);
      }
      const userData = await response.json();
        //return json data
        return userData;} 
            catch (error) {
            console.error("An error occurred while fetching user data:", error);
                return null;}}
  
//#13
async function getPostComments(postId) {
    if (!postId || typeof postId !== 'number') {
      return undefined; }
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
      if (!response.ok) {
        throw new Error(`Error fetching comments for post ${postId}: ${response.statusText}`);}
      const commentsData = await response.json();
        return commentsData;} 
            catch (error) {
            console.error("An error occurred while fetching post comments:", error);
                return null;}}

//#14
async function displayComments(postId) {
    if (!postId || typeof postId !== 'number') {
      return undefined;}
        //element to hold comments
        const section = document.createElement('section');
        section.dataset.postId = postId;
        //adding classes
        section.classList.add('comments', 'hide');
    try {
      const comments = await getPostComments(postId);
      if (comments) {
        const fragment = createComments(comments);
        section.appendChild(fragment);} 
        else {
            console.log('No comments found for this post.');}}     
    catch (error) {
      console.error("An error occurred while displaying comments:", error);}
        return section;}
  
//#15
async function createPosts(posts) {
    if (!posts || !Array.isArray(posts)) {
      return undefined;}
    const fragment = document.createDocumentFragment();
    for (const post of posts) {
      const article = document.createElement('article');
      const h2 = createElemWithText('h2', post.title);
      const pBody = createElemWithText('p', post.body);
      const pId = createElemWithText('p', `Post ID: ${post.id}`);
    try {
        const author = await getUser(post.userId);
        const pAuthor = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const pCatchphrase = createElemWithText('p', `${author.company.catchPhrase}`);
        const button = document.createElement('button');
        button.textContent = 'Show Comments';
        button.dataset.postId = post.id;
  
        article.appendChild(h2);
        article.appendChild(pBody);
        article.appendChild(pId);
        article.appendChild(pAuthor);
        article.appendChild(pCatchphrase);
        article.appendChild(button);
  
        const section = await displayComments(post.id);

        article.appendChild(section);} 
    catch (error) {
        console.error(`Error while creating post with ID ${post.id}:`, error);}
        fragment.appendChild(article);}
            return fragment;}

//#16
async function displayPosts(posts) {
    //select main element
    const mainElement = document.querySelector('main');
    const element = posts && posts.length > 0
      ? await createPosts(posts) 
      : createElemWithText('p', 'No posts available.', 'default-text'); 
      //append
      mainElement.appendChild(element);
    return element;}

//#17
function toggleComments(event, postId) {
    //check for even and post id
    if (!event || !postId) {
      return undefined; }
    event.target.listener = true;
    //pass post id
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
        return [section, button];}
  
//#18
async function refreshPosts(posts) {
    //post data
    if (!posts) {
      return undefined; }
    //calling functions
    const removeButtons = removeButtonListeners();
    const mainElement = document.querySelector('main');
    const main = deleteChildElements(mainElement);
    //pass json data
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
        return [removeButtons, main, fragment, addButtons];}

//#19
async function selectMenuChangeEventHandler(event) {
    if (!event) {
      return undefined; }
    const selectMenu = event.target;
    selectMenu.disabled = true;
    const userId = selectMenu.value || 1;
    try {
      const posts = await getUserPosts(userId);
      const refreshPostsArray = await refreshPosts(posts);
      selectMenu.disabled = false;
        return [userId, posts, refreshPostsArray];} 
    catch (error) {
      console.error('Error fetching posts:', error);
      selectMenu.disabled = false;
      return undefined;}}

//#20
async function initPage() {
    try {
      //gets users to json
      const users = await getUsers();
      //pass data to popsm 
      const select = populateSelectMenu(users);
        //return resutls in array
        return [users, select];} 
      catch (error) {
      console.error("Error initializing the page:", error);
      throw error;}}

//#21
function initApp() {
    //call initpage
    initPage()
      .then(([users, select]) => {
        //select menu via id
        const selectMenu = document.getElementById('selectMenu');
        selectMenu.addEventListener('change', selectMenuChangeEventHandler);
        selectMenu.replaceWith(select); })
      .catch(error => {
        console.error("Error initializing the app:", error);
      });}
  document.addEventListener('DOMContentLoaded', initApp);
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  