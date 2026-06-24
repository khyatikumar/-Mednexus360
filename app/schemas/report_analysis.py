from pydantic import BaseModel


class ReportAnalysisResponse(
    BaseModel
):

    analysis: str