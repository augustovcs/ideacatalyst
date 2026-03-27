namespace DTOs;

public class HistoryItemDTO
{
    public Guid Id { get; set; }

    public string IdeaDescription { get; set; }

    public string AnalysisResult { get; set; }

    public Guid? SessionId { get; set; }

    public bool WasMock { get; set; }

    public DateTime CreatedAt { get; set; }
}

public class CreateHistoryItemDTO
{
    public string IdeaDescription { get; set; }

    public string AnalysisResult { get; set; }

    public string SessionId { get; set; }

    public bool WasMock { get; set; }
}
