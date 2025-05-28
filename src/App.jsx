// App.js
import { useState } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import "./App.css";
import { backendUrl } from "./CommonExports";

const temperatureOptions = [0.0, 0.7, 1.2];
const maxTokensOptions = [50, 150, 300];
const presencePenaltyOptions = [0.0, 1.5];
const frequencyPenaltyOptions = [0.0, 1.5];
const models = ["gpt-3.5-turbo", "gpt-4"];

function App() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      systemPrompt:
        "You are a helpful assistant that writes product descriptions.",
      userPrompt: "Write a product description for an iPhone.",
      configs: [
        {
          model: "gpt-4",
          temperature: 0.7,
          max_tokens: 150,
          presence_penalty: 0.0,
          frequency_penalty: 0.0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "configs",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState("");
  const [reflecting, setReflecting] = useState(false);

  const generateReflection = async () => {
    setReflecting(true);
    setReflection("");
    try {
      const res = await axios.post(`${backendUrl}api/analyze`, {
        results,
      });
      setReflection(res.data.reflection);
    } catch (err) {
      setReflection(`Error: ${err.message}`);
    } finally {
      setReflecting(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const { systemPrompt, userPrompt, configs } = data;
    const allResults = [];

    for (let config of configs) {
      const parsedConfig = {
        ...config,
        model: config.model,
        temperature: parseFloat(config.temperature),
        max_tokens: parseInt(config.max_tokens),
        presence_penalty: parseFloat(config.presence_penalty),
        frequency_penalty: parseFloat(config.frequency_penalty),
      };

      try {
        const res = await axios.post(`${backendUrl}api/generate`, {
          systemPrompt,
          userPrompt,
          ...parsedConfig,
          stop: null,
        });

        allResults.push({ ...parsedConfig, output: res.data.output });
      } catch (err) {
        allResults.push({ ...parsedConfig, output: `Error: ${err.message}` });
      }
    }

    setResults(allResults);
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Interactive Prompt Playground</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>System Prompt:</label>
          <textarea {...register("systemPrompt")} rows={2} />
        </div>

        <div className="form-group">
          <label>User Prompt:</label>
          <textarea {...register("userPrompt")} rows={2} />
        </div>

        <div>
          <h2>Prompt Configurations</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="config-row">
              <div>
                <label>Model</label>
                <select {...register(`configs.${index}.model`)}>
                  {models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Temperature</label>
                <select {...register(`configs.${index}.temperature`)}>
                  {temperatureOptions.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Max Tokens</label>
                <select {...register(`configs.${index}.max_tokens`)}>
                  {maxTokensOptions.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Presence Penalty</label>
                <select {...register(`configs.${index}.presence_penalty`)}>
                  {presencePenaltyOptions.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Frequency Penalty</label>
                <select {...register(`configs.${index}.frequency_penalty`)}>
                  {frequencyPenaltyOptions.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              append({
                model: "gpt-4",
                temperature: 0.7,
                max_tokens: 150,
                presence_penalty: 0.0,
                frequency_penalty: 0.0,
              })
            }
            className="add-button"
          >
            + Add Configuration
          </button>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="results">
          <h2>Results</h2>
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Temp</th>
                <th>Max Tokens</th>
                <th>Presence</th>
                <th>Frequency</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, idx) => (
                <tr key={idx}>
                  <td>{res.model}</td>
                  <td>{res.temperature}</td>
                  <td>{res.max_tokens}</td>
                  <td>{res.presence_penalty}</td>
                  <td>{res.frequency_penalty}</td>
                  <td className="output-cell">{res.output}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={generateReflection}
              disabled={reflecting}
              className="submit-button"
            >
              {reflecting ? "Analyzing..." : "Generate 2-Paragraph Reflection"}
            </button>
          </div>
          {reflection && (
            <div className="reflection">
              <h2>Reflection</h2>
              <p>{reflection}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
