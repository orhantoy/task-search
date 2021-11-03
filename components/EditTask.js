import { useEffect } from "react";

export default function EditTask({
  task,
  buttonText = "Save",
  onChange,
  onCompletedChange,
  onButtonClick,
}) {
  const { title, assignee, completed, points, tags } = task;

  useEffect(() => {
    if (!Array.isArray(tags)) {
      return onChange("tags", [""]);
    }

    let newTags = tags.filter((tag) => tag !== "");
    if (newTags.length === 0 || newTags[newTags.length - 1] !== "") {
      newTags.push("");
    }
    if (tags.length !== newTags.length) {
      onChange("tags", newTags);
    }
  }, [onChange, tags]);

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
          style={{
            border: "1px solid #bbb",
            width: "300px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
          value={title || ""}
          onChange={(e) => onChange("title", e.target.value)}
        />{" "}
        <input
          type="text"
          placeholder="Assignee"
          style={{ border: "1px solid #bbb", fontSize: "18px" }}
          value={assignee || ""}
          onChange={(e) => onChange("assignee", e.target.value)}
        />{" "}
        <input
          type="number"
          placeholder="Points"
          style={{ border: "1px solid #bbb", width: "100px", fontSize: "18px" }}
          value={points || ""}
          onChange={(e) => onChange("points", e.target.value)}
          min="0"
        />{" "}
        {buttonText && (
          <button
            type="button"
            onClick={onButtonClick}
            style={{ fontSize: "16px" }}
          >
            {buttonText}
          </button>
        )}
      </div>
      <div style={{ marginTop: "4px" }}>
        <span title="Tags">🏷</span>{" "}
        {Array.isArray(tags) &&
          tags.map((tag, tagIndex) => {
            return (
              <input
                type="text"
                key={tagIndex}
                value={tag}
                style={{
                  border: "1px solid #ddd",
                  width: "100px",
                  fontSize: "12px",
                  marginRight: "4px",
                  padding: "2px 4px",
                  borderRadius: "12px",
                }}
                onChange={(e) => {
                  let newTags = [...tags];
                  newTags[tagIndex] = e.target.value;
                  onChange("tags", newTags);
                }}
              />
            );
          })}
      </div>
    </>
  );
}
