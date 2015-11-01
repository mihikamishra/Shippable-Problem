# Shippable-Problem
Problem Description   Create a repository on GitHub and write a program in any programming language that will do the following:   Input : User can input a link to any public GitHub repository  Output :  Your UI should display a table with the following information -  - Total number of open issues  - Number of open issues that were opened in the last 24 hours  - Number of open issues that were opened more than 24 hours ago but less than 7 days ago  - Number of open issues that were opened more than 7 days ago   Deploy your application to Heroku or similar platform. 

Proposed Solution:
The URL of the repository is retrieved and validated whether it is a valid github repository.The Github Api returns back only 30 issues per page.Inorder tie view the total number of pages, the response headers are being checked and the total number of pages are being retrieved (i.e the last page number).Ajax request is being sent to all pages to get all the issues in json format. All reponses are parsed and issues are saved by checking their created_at timestamp.

