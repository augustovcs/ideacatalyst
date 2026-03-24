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

        [Column("full_analysis")]
        public string FullAnalysis { get; set; }

        [Column("idea_title")]
        public string? IdeaTitle { get; set; }

        [Column("market_size")]
        public string? MarketSize { get; set; }

        [Column("cagr")]
        public decimal? Cagr { get; set; }

        [Column("roi")]
        public decimal? Roi { get; set; }

        [Column("break_even_months")]
        public int? BreakEvenMonths { get; set; }

        [Column("customer_acquisition_cost")]
        public decimal? CustomerAcquisitionCost { get; set; }

        [Column("lifetime_value")]
        public decimal? LifetimeValue { get; set; }

        [Column("status")]
        public string Status { get; set; } = "pending";

        [Column("error_message")]
        public string? ErrorMessage { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}