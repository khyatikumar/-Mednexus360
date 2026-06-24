def recommend_doctor(
    condition: str
):

    mapping = {

        "Heart Disease":
        "Cardiologist",

        "Migraine":
        "Neurologist",

        "Flu":
        "General Physician",

        "COVID-19":
        "Pulmonologist"
    }

    return mapping.get(
        condition,
        "General Physician"
    )