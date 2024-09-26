export function NftAttributes({
  attributes,
}: {
  attributes: Record<string, unknown>;
}) {
  /**
   * Assume the NFT attributes follow the conventional format
   */
  const items = attributes.filter(
    (item: Record<string, unknown>) => item.trait_type
  );

  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <span style={{ flex: 1, textAlign: "left" }}>Traits</span>
        <span style={{ fontSize: "12px", fontWeight: "bold" }}>▼</span> {/* Replace with arrow icon if needed */}
      </div>
      <div style={{ padding: "16px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {items.map((item) => (
          <div
            key={item.trait_type as string}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "transparent",
            }}
          >
            {item.trait_type && (
              <div
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  lineHeight: 1.2,
                  marginBottom: "4px",
                }}
              >
                {item.trait_type}
              </div>
            )}
            <div
              style={{
                fontSize: "14px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {typeof item.value === "object"
                ? JSON.stringify(item.value || {})
                : item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
