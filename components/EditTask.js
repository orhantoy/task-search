import { useEffect } from "react";

export default function EditTask({
  task,
  buttonText = "Save",
  onChange,
  onCompletedChange,
  onButtonClick,
}) {
  const { title, assignee, completed, points, labels } = task;

  useEffect(() => {
    if (!Array.isArray(labels)) {
      return onChange("labels", [""]);
    }

    let newLabels = labels.filter((label) => label !== "");
    if (newLabels.length === 0 || newLabels[newLabels.length - 1] !== "") {
      newLabels.push("");
    }
    if (labels.length !== newLabels.length) {
      onChange("labels", newLabels);
    }
  }, [onChange, labels]);

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
        <span title="Labels">🏷</span>{" "}
        {Array.isArray(labels) &&
          labels.map((label, labelIndex) => {
            return (
              <input
                type="text"
                key={labelIndex}
                value={label}
                style={{
                  border: "1px solid #ddd",
                  width: "100px",
                  fontSize: "12px",
                  marginRight: "4px",
                  padding: "2px 4px",
                  borderRadius: "12px",
                }}
                onChange={(e) => {
                  let newLabels = [...labels];
                  newLabels[labelIndex] = e.target.value;
                  onChange("labels", newLabels);
                }}
              />
            );
          })}
      </div>
    </>
  );
}
