namespace DTOs;


public class AnswersDTO
{

    //public string uuid_id { get; set; }
    public string answer { get; set; }
    public string status { get; set; }
    public DateTime created_at { get; set;}

}

public class AnalysisResultDTO
{
    public Guid id { get; set; }
    public Guid sessionId { get; set; }
    public int? score { get; set; }
    public string fullAnalysis { get; set; }
    public string? ideaTitle { get; set; }
    public string? marketSize { get; set; }
    public decimal? cagr { get; set; }
    public decimal? roi { get; set; }
    public int? breakEvenMonths { get; set; }
    public decimal? customerAcquisitionCost { get; set; }
    public decimal? lifetimeValue { get; set; }
    public string status { get; set; }
    public string? errorMessage { get; set; }
    public DateTime createdAt { get; set; }
    public DateTime updatedAt { get; set; }
}