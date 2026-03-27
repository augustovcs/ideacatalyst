using System;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Models;

[Table("idea_history")]
public class IdeaHistory : BaseModel
{
    [PrimaryKey("id", false)]
    public Guid Id { get; set; }

    [Column("user_id")]
    public Guid UserId { get; set; }

    [Column("idea_description")]
    public string IdeaDescription { get; set; }

    [Column("analysis_result")]
    public string AnalysisResult { get; set; }

    [Column("session_id")]
    public string SessionId { get; set; }

    [Column("was_mock")]
    public bool WasMock { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }
}
