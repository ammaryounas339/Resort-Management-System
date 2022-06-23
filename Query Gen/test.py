import random
import decimal

with open("Query Gen/names.txt",'r') as file:
    names = file.read()
    names = names.split()
   
nums =[0,1,2,3,4,5,6,7,8,9]
gender = ['Male','Female']

months = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: 'Jun',
          7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"}
days = {1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30,
        7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31}

room = 1
review_no =100
day = 1
month = 1
year = 2019
x = 6
num = 7
reviews = [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,2,2,2,2,1,1,1]
with open('Queries/Insert_Small.sql','w') as file:
    while(year<2022 or month<2):
        if(room>17):
            room = random.randint(1,3)
            day+=num
            num = random.randint(1,7)
        first = random.choice(names)
        last = random.choice(names)
        date1 = f"{day}-{months[month]}-{year}"
        if day+num>days[month]:
            day = (day+num)%days[month]
            month+=1
            if month>=13:
                year+=1
                month = 1
        date2 = f"{day+num}-{months[month]}-{year}"
        
        email =  first+''.join(str(random.choice(nums)) for _ in range(3)) + '@gmail.com'
        phone = '0'+''.join(str(random.choice(nums)) for _ in nums)
        order = [1,2,3]
        orders = [f'({x},'+str(order.pop(random.randint(0,len(order)-1)))+')' for _ in range(random.randint(1,3))]
        query1 = f"Insert into Users \nvalues({x},'password','{first+str(x)}')"
        query2 = f"Insert into Client \nvalues({x},'{first}','{last}','{phone}','{random.choice(gender)}','{email}',Default)"
        query3 = f"Insert into Booking \nvalues({x},{room},'{date1}','{date2}')"
        query4 = f"Insert into Orders \nvalues{','.join(orders)}"
        
        query5 = f"Insert into FoodReservation \nvalues({x},Default,{random.randint(1,20)})"
        query6 = f"Insert into Review \nvalues({review_no},{random.choice(reviews)},'Speechless',{x})"
        query7 = f"Insert into Bill \nvalues ({review_no},'{date2}',{decimal.Decimal(random.randrange(25500, 999999))/100},{x})"
        room+=random.randint(1,3)
        review_no+=1
        x+=1
        
        file.write(query1+"\n\n"+query2+"\n\n"+query3+"\n\n"+query4+"\n\n"+query5+"\n\n"+query6+"\n\n"+query7+"\n\n")
        # file.write(query3+"\n\n")
    
