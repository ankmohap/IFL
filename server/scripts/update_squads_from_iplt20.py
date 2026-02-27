#!/usr/bin/env python3
"""Best-effort IPL squad refresh using latest team-page data.

Source intent: https://www.iplt20.com/teams
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(ROOT))

from server import app  # noqa: E402

FOREIGN_PLAYERS = {
    "Devon Conway", "Rachin Ravindra", "Sam Curran", "Jamie Overton", "Noor Ahmad", "Matheesha Pathirana", "Nathan Ellis",
    "Faf du Plessis", "Jake Fraser-McGurk", "Tristan Stubbs", "Donovan Ferreira", "Dushmantha Chameera", "Mitchell Starc",
    "Jos Buttler", "Glenn Phillips", "Kagiso Rabada", "Gerald Coetzee", "Rashid Khan",
    "Quinton de Kock", "Rahmanullah Gurbaz", "Rovman Powell", "Andre Russell", "Moeen Ali", "Sunil Narine", "Spencer Johnson", "Anrich Nortje",
    "David Miller", "Aiden Markram", "Matthew Breetzke", "Nicholas Pooran", "Mitchell Marsh",
    "Will Jacks", "Mitchell Santner", "Corbin Bosch", "Trent Boult", "Reece Topley", "Mujeeb Ur Rahman", "Robin Minz", "Ryan Rickelton",
    "Josh Inglis", "Marcus Stoinis", "Glenn Maxwell", "Azmatullah Omarzai", "Marco Jansen", "Lockie Ferguson", "Xavier Bartlett", "Aaron Hardie",
    "Josh Hazlewood", "Phil Salt", "Liam Livingstone", "Tim David", "Romario Shepherd", "Nuwan Thushara", "Jacob Bethell", "Lungi Ngidi",
    "Shimron Hetmyer", "Jofra Archer", "Fazalhaq Farooqi", "Kwena Maphaka", "Maheesh Theekshana", "Wanindu Hasaranga",
    "Pat Cummins", "Travis Head", "Heinrich Klaasen", "Adam Zampa", "Kamindu Mendis", "Brydon Carse", "Eshan Malinga",
}

SQUADS = {
    "CSK": [
        ("Ruturaj Gaikwad", "BAT"), ("MS Dhoni", "WK"), ("Devon Conway", "WK"), ("Rahul Tripathi", "BAT"), ("Shaik Rasheed", "BAT"),
        ("Vansh Bedi", "WK"), ("Andre Siddarth", "BAT"), ("Ravindra Jadeja", "ALL"), ("Rachin Ravindra", "ALL"), ("Vijay Shankar", "ALL"),
        ("Sam Curran", "ALL"), ("Deepak Hooda", "ALL"), ("Jamie Overton", "ALL"), ("Shivam Dube", "ALL"), ("Ramakrishna Ghosh", "ALL"),
        ("Ravichandran Ashwin", "ALL"), ("Noor Ahmad", "BOWL"), ("Matheesha Pathirana", "BOWL"), ("Khaleel Ahmed", "BOWL"),
        ("Mukesh Choudhary", "BOWL"), ("Gurjapneet Singh", "BOWL"), ("Nathan Ellis", "BOWL"), ("Shreyas Gopal", "BOWL"),
        ("Kamlesh Nagarkoti", "BOWL"), ("Anshul Kamboj", "BOWL"),
    ],
    "DC": [
        ("KL Rahul", "WK"), ("Faf du Plessis", "BAT"), ("Jake Fraser-McGurk", "BAT"), ("Karun Nair", "BAT"), ("Abishek Porel", "WK"),
        ("Tristan Stubbs", "WK"), ("Donovan Ferreira", "WK"), ("Sameer Rizvi", "BAT"), ("Ashutosh Sharma", "ALL"), ("Darshan Nalkande", "BOWL"),
        ("Vipraj Nigam", "ALL"), ("Dushmantha Chameera", "BOWL"), ("Mitchell Starc", "BOWL"), ("Kuldeep Yadav", "BOWL"),
        ("Mohit Sharma", "BOWL"), ("T Natarajan", "BOWL"), ("Mukesh Kumar", "BOWL"), ("Axar Patel", "ALL"), ("Madhav Tiwari", "ALL"),
        ("Tripurana Vijay", "ALL"), ("Ajay Mandal", "ALL"), ("Manvanth Kumar", "ALL"),
    ],
    "GT": [
        ("Shubman Gill", "BAT"), ("Jos Buttler", "WK"), ("Sai Sudharsan", "BAT"), ("Shahrukh Khan", "BAT"), ("Glenn Phillips", "WK"),
        ("Kumar Kushagra", "WK"), ("Mahipal Lomror", "ALL"), ("Nishant Sindhu", "ALL"), ("Washington Sundar", "ALL"),
        ("Mohammed Siraj", "BOWL"), ("Prasidh Krishna", "BOWL"), ("Kagiso Rabada", "BOWL"), ("Gerald Coetzee", "BOWL"),
        ("Ishant Sharma", "BOWL"), ("Sai Kishore", "BOWL"), ("Rashid Khan", "ALL"), ("Rahul Tewatia", "ALL"),
        ("Arshad Khan", "ALL"), ("Kulwant Khejroliya", "BOWL"),
    ],
    "KKR": [
        ("Ajinkya Rahane", "BAT"), ("Rinku Singh", "BAT"), ("Quinton de Kock", "WK"), ("Rahmanullah Gurbaz", "WK"),
        ("Angkrish Raghuvanshi", "BAT"), ("Rovman Powell", "BAT"), ("Manish Pandey", "BAT"), ("Luvnith Sisodia", "WK"),
        ("Venkatesh Iyer", "ALL"), ("Andre Russell", "ALL"), ("Ramandeep Singh", "ALL"), ("Moeen Ali", "ALL"),
        ("Anukul Roy", "ALL"), ("Sunil Narine", "ALL"), ("Harshit Rana", "BOWL"), ("Vaibhav Arora", "BOWL"),
        ("Mayank Markande", "BOWL"), ("Spencer Johnson", "BOWL"), ("Chetan Sakariya", "BOWL"), ("Anrich Nortje", "BOWL"),
    ],
    "LSG": [
        ("Rishabh Pant", "WK"), ("David Miller", "BAT"), ("Aiden Markram", "BAT"), ("Aryan Juyal", "WK"), ("Himmat Singh", "BAT"),
        ("Matthew Breetzke", "BAT"), ("Nicholas Pooran", "WK"), ("Mitchell Marsh", "ALL"), ("Abdul Samad", "ALL"), ("Shahbaz Ahmed", "ALL"),
        ("Yuvraj Chaudhary", "ALL"), ("Rajvardhan Hangargekar", "ALL"), ("Arshin Kulkarni", "ALL"), ("Ayush Badoni", "ALL"),
        ("Shardul Thakur", "ALL"), ("Akash Deep", "BOWL"), ("Avesh Khan", "BOWL"), ("Akash Singh", "BOWL"),
        ("Ravi Bishnoi", "BOWL"), ("Mohsin Khan", "BOWL"), ("M Siddharth", "BOWL"), ("Digvesh Rathi", "BOWL"), ("Prince Yadav", "BOWL"),
    ],
    "MI": [
        ("Hardik Pandya", "ALL"), ("Rohit Sharma", "BAT"), ("Suryakumar Yadav", "BAT"), ("Tilak Varma", "BAT"), ("Bevon Jacobs", "BAT"),
        ("Naman Dhir", "ALL"), ("Will Jacks", "ALL"), ("Raj Angad Bawa", "ALL"), ("Vignesh Puthur", "BOWL"), ("Mitchell Santner", "ALL"),
        ("Corbin Bosch", "ALL"), ("Trent Boult", "BOWL"), ("Deepak Chahar", "BOWL"), ("Jasprit Bumrah", "BOWL"), ("Reece Topley", "BOWL"),
        ("Mujeeb Ur Rahman", "BOWL"), ("Karn Sharma", "BOWL"), ("Arjun Tendulkar", "BOWL"), ("Ashwani Kumar", "BOWL"),
        ("Robin Minz", "WK"), ("Ryan Rickelton", "WK"), ("Krishnan Shrijith", "WK"), ("Satyanarayana Raju", "BOWL"),
    ],
    "PBKS": [
        ("Shreyas Iyer", "BAT"), ("Prabhsimran Singh", "WK"), ("Priyansh Arya", "BAT"), ("Pyla Avinash", "BAT"), ("Josh Inglis", "WK"),
        ("Vishnu Vinod", "WK"), ("Marcus Stoinis", "ALL"), ("Glenn Maxwell", "ALL"), ("Azmatullah Omarzai", "ALL"),
        ("Harpreet Brar", "ALL"), ("Marco Jansen", "ALL"), ("Shashank Singh", "ALL"), ("Nehal Wadhera", "BAT"),
        ("Suryansh Shedge", "ALL"), ("Musheer Khan", "ALL"), ("Arshdeep Singh", "BOWL"), ("Yuzvendra Chahal", "BOWL"),
        ("Lockie Ferguson", "BOWL"), ("Vijaykumar Vyshak", "BOWL"), ("Yash Thakur", "BOWL"), ("Kuldeep Sen", "BOWL"),
        ("Praveen Dubey", "BOWL"), ("Xavier Bartlett", "BOWL"), ("Aaron Hardie", "ALL"), ("Harnoor Pannu", "BAT"),
    ],
    "RCB": [
        ("Rajat Patidar", "BAT"), ("Virat Kohli", "BAT"), ("Yash Dayal", "BOWL"), ("Josh Hazlewood", "BOWL"), ("Phil Salt", "WK"),
        ("Jitesh Sharma", "WK"), ("Liam Livingstone", "ALL"), ("Rasikh Dar", "BOWL"), ("Suyash Sharma", "BOWL"), ("Krunal Pandya", "ALL"),
        ("Bhuvneshwar Kumar", "BOWL"), ("Swapnil Singh", "ALL"), ("Tim David", "BAT"), ("Romario Shepherd", "ALL"),
        ("Nuwan Thushara", "BOWL"), ("Manoj Bhandage", "ALL"), ("Jacob Bethell", "ALL"), ("Devdutt Padikkal", "BAT"),
        ("Swastik Chikara", "BAT"), ("Lungi Ngidi", "BOWL"), ("Abhinandan Singh", "BOWL"), ("Mohit Rathee", "BOWL"),
    ],
    "RR": [
        ("Sanju Samson", "WK"), ("Yashasvi Jaiswal", "BAT"), ("Shimron Hetmyer", "BAT"), ("Riyan Parag", "ALL"), ("Dhruv Jurel", "WK"),
        ("Shubham Dubey", "BAT"), ("Vaibhav Suryavanshi", "BAT"), ("Kunal Rathore", "WK"), ("Jofra Archer", "BOWL"),
        ("Sandeep Sharma", "BOWL"), ("Tushar Deshpande", "BOWL"), ("Akash Madhwal", "BOWL"), ("Fazalhaq Farooqi", "BOWL"),
        ("Kwena Maphaka", "BOWL"), ("Ashok Sharma", "BOWL"), ("Maheesh Theekshana", "BOWL"), ("Wanindu Hasaranga", "ALL"),
        ("Nitish Rana", "BAT"), ("Yudhvir Singh", "ALL"), ("Kumar Kartikeya", "BOWL"),
    ],
    "SRH": [
        ("Pat Cummins", "ALL"), ("Travis Head", "BAT"), ("Abhishek Sharma", "ALL"), ("Nitish Kumar Reddy", "ALL"),
        ("Heinrich Klaasen", "WK"), ("Ishan Kishan", "WK"), ("Mohammed Shami", "BOWL"), ("Harshal Patel", "BOWL"),
        ("Rahul Chahar", "BOWL"), ("Adam Zampa", "BOWL"), ("Atharva Taide", "BAT"), ("Abhinav Manohar", "BAT"),
        ("Simarjeet Singh", "BOWL"), ("Zeeshan Ansari", "BOWL"), ("Jaydev Unadkat", "BOWL"), ("Kamindu Mendis", "ALL"),
        ("Brydon Carse", "ALL"), ("Aniket Verma", "BAT"), ("Eshan Malinga", "BOWL"), ("Sachin Baby", "BAT"),
    ],
}


def normalize_users_with_new_ids(old_users, old_players, new_players):
    old_by_id = {p["id"]: p["name"] for p in old_players}
    new_by_name = {p["name"]: p["id"] for p in new_players}

    for _, user in old_users.items():
        mapped = []
        for pid in user.get("players", []):
            name = old_by_id.get(pid)
            if name and name in new_by_name:
                mapped.append(new_by_name[name])
        user["players"] = sorted(set(mapped))
    return old_users


def build_players():
    players = []
    pid = 1
    for team, roster in SQUADS.items():
        for name, role in roster:
            players.append(
                {
                    "id": pid,
                    "team": team,
                    "name": name,
                    "role": role,
                    "country": "INTL" if name in FOREIGN_PLAYERS else "India",
                }
            )
            pid += 1
    return players


def main():
    app.init_db()
    old_store = app.read_store()
    players = build_players()

    app.write_key("ifl_master_players", players)
    users = normalize_users_with_new_ids(old_store.get("ifl_users", {}), old_store.get("ifl_master_players", []), players)
    app.write_key("ifl_users", users)

    print(f"Updated squads: {len(players)} players across {len(SQUADS)} teams")


if __name__ == "__main__":
    main()
