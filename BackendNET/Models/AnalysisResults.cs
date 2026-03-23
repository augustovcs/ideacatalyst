using System;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Models
{
    [Table("analysis_results")]
    public class AnalysisResult : BaseModel
    {
        [PrimaryKey("id", false)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Column("session_id")]        
        public Guid SessionId { get; set; }

        [Column("score")]
        public int? Score { get; set; }

        [Column("analysis")]
        public string? Analysis { get; set; }

        [Column("risks")]
        public string? Risks { get; set; }

        [Column("suggestions")]
        public string? Suggestions { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}