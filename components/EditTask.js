export default function EditTask({
  task,
  buttonText = "Save",
  onChange,
  onCompletedChange,
  onButtonClick,
}) {
  const { title, assignee, completed, points, tags } = task;

  let allTags = [];
  if (Array.isArray(tags)) {
    allTags = [...tags];
  }

  if (allTags.length === 0 || allTags[allTags.length - 1] !== "") {
    allTags.push("");
  }

  return (
    <>
      <div>
        {"id" in task && (
          <>
            <input
              type="checkbox"
              checked={!!completed}
              disabled={!onCompletedChange}
              onChange={(e) => onCompletedChange(e.target.checked)}
            />{" "}
          </>
        )}
        <input
          type="text"
          placeholder="Task"
          style={{ width: "300px", fontSize: "18px", fontWeight: "bold" }}
          value={title || ""}
          onChange={(e) => onChange("title", e.target.value)}
        />{" "}
        <input
          type="text"
          placeholder="Assignee"
          style={{ fontSize: "18px" }}
          value={assignee || ""}
          onChange={(e) => onChange("assignee", e.target.value)}
        />{" "}
        <input
          type="number"
          placeholder="Points"
          style={{ width: "100px", fontSize: "18px" }}
          value={points || ""}
          onChange={(e) => onChange("points", e.target.value)}
          min="0"
        />{" "}
        {buttonText && (
          <button type="button" onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
      <div style={{ marginTop: "4px" }}>
        <span title="Tags">🏷</span>{" "}
        {allTags.map((tag, tagIndex) => {
          return (
            <input
              type="text"
              key={tagIndex}
              value={tag}
              style={{
                width: "100px",
                fontSize: "12px",
                marginRight: "4px",
                borderRadius: "12px",
              }}
              onChange={(e) => {
                let newTags = [];

                if (Array.isArray(tags)) {
                  newTags = [...tags];
                }

                newTags[tagIndex] = e.target.value;

                if (
                  Array.isArray(tags) &&
                  tags.length > 1 &&
                  newTags[tagIndex] === ""
                ) {
                  newTags.splice(tagIndex, 1);
                }

                onChange("tags", newTags);
              }}
            />
          );
        })}
      </div>
    </>
  );
}
