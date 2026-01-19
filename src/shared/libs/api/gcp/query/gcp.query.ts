import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {Gcp} from "src/shared/libs/api/gcp/type/gcp.type";
import {Keys} from "src/shared/libs/api/gcp/query/keys";
import {postGcpUploadApi} from "src/shared/libs/api/gcp/api/gcp.api";

export const useGcpUploadMutation = (
    options?: UseMutationOptions<Gcp, Error, File>
) =>
    useMutation({
        mutationKey: [Keys.gcp.upload],
        mutationFn: (file) => postGcpUploadApi(file),
        ...options,
    });