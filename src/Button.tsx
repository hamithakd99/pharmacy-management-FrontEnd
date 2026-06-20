import { useEffect, useState } from "react"

function Button({ countToDisplay }: { countToDisplay?: (count: number) => void }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
    countToDisplay?.(count);
    }, [count, countToDisplay]);

    return (
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Click Me
        </button>
    )
}

export default Button;