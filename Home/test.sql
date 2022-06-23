Select C.ClientFirstName,C.ClientLastName,R.ReviewRating,R.ReviewComments from Client as C
inner join Review as R
on R.ClientID = C.ClientID