from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()  

class CheckInData(BaseModel):
    sleepHours: int
    meals: int
    exerciseMinutes: int

@app.post("/recommend")
def recommend(data: CheckInData):
    recommendations = []

    if data.sleepHours < 7:
        recommendations.append("Durma pelo menos 7h para melhor recuperação.")
    if data.meals < 3:
        recommendations.append("Consuma pelo menos 3 refeições balanceadas ao dia.")
    if data.exerciseMinutes < 30:
        recommendations.append("Pratique ao menos 30 min de atividade física.")

    if not recommendations:
        recommendations.append("Continue assim! Você está no caminho certo.")

    return {"recommendations": recommendations}
